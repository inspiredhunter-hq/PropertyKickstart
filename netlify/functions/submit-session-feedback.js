// ACT-634: Secure, server-side Notion submission endpoint.
// Configure NOTION_TOKEN as a private Netlify environment variable.
// Never put this token in browser-side HTML or GitHub.
const DATABASE_ID = "51ace8ab7d9446ea8be23c6511831233";
const rich = value => ({rich_text:[{text:{content:String(value||"").slice(0,1800)}}]});
const checkbox = value => ({checkbox:value===true||value==="on"||value==="true"||value==="Yes"});
exports.handler = async event => {
  if(event.httpMethod!=="POST") return {statusCode:405,body:JSON.stringify({error:"Method not allowed"})};
  const token=process.env.NOTION_TOKEN || process.env.NOTION_API_KEY;
  if(!token) return {statusCode:503,headers:{"Content-Type":"application/json"},body:JSON.stringify({error:"Feedback temporarily unavailable"})};
  let d;
  try {d=JSON.parse(event.body||"{}");} catch {return {statusCode:400,body:JSON.stringify({error:"Invalid JSON"})};}
  if(d.bot_field) return {statusCode:200,body:JSON.stringify({ok:true})};
  if(!d.helpful_part||!d.next_step|| !/^\d{4}-\d{2}-\d{2}$/.test(d.session_date||""))return {statusCode:400,body:JSON.stringify({error:"Required fields missing"})};
  if(d.helpful_part==="Other"&&!String(d.helpful_other||"").trim())return {statusCode:400,body:JSON.stringify({error:"Please describe Other"})};
  if((d.contact_permission||d.marketing_consent)&&!d.email)return {statusCode:400,body:JSON.stringify({error:"Email needed for selected consent"})};
  if(d.email&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.email))return {statusCode:400,body:JSON.stringify({error:"Invalid email"})};
  const fields={Response:{title:[{text:{content:"Feedback · "+d.session_date+" · "+String(d.property_reference||"General").slice(0,40)}}]},
    "Session Date":{date:{start:d.session_date}},
    "Property Reference":rich(d.property_reference),"Helpful Part":rich(d.helpful_part),"Helpful Other":rich(d.helpful_other),
    "Most Useful":rich(d.most_valuable),"Explain Better":rich(d.improvements),"Next Step":rich(d.next_step),
    "Future Topic":rich(d.future_topic),"Name":rich(d.name),"Contact Consent":checkbox(d.contact_permission),
    "Marketing Consent":checkbox(d.marketing_consent),"Event Name":rich(d.event),
    "Submitted At":{date:{start:new Date().toISOString()}}};
  if(d.email)fields.Email={email:String(d.email).slice(0,250)};
  try {
    const response=await fetch("https://api.notion.com/v1/pages",{
      method:"POST",headers:{"Authorization":"Bearer "+token,"Notion-Version":"2022-06-28","Content-Type":"application/json"},
      body:JSON.stringify({parent:{database_id:DATABASE_ID},properties:fields})
    });
    if(!response.ok){console.error("Notion feedback save failed",response.status);return {statusCode:502,headers:{"Content-Type":"application/json"},body:JSON.stringify({error:"Feedback could not be saved. Please try again."})};}
    const saved=await response.json();
    if(!saved.id)return {statusCode:502,body:JSON.stringify({error:"Feedback not confirmed"})};
    return {statusCode:200,headers:{"Content-Type":"application/json"},body:JSON.stringify({ok:true})};
  }catch(error){console.error("Feedback transport failure",error?.message);return {statusCode:502,headers:{"Content-Type":"application/json"},body:JSON.stringify({error:"Feedback could not be saved. Please try again."})};}
};