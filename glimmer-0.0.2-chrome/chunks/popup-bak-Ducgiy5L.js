import{j as e,B as t,b as o,M as c,c as r,R as a}from"./types-BC-UewbI.js";function i(){async function s(){let n=await o.runtime.sendMessage({eventType:c.clickExtIcon});console.log(n)}return e.jsx("div",{className:"grid grid-cols-1 gap-3",children:e.jsx(t,{onClick:s,children:"send message"})})}r.createRoot(document.getElementById("root")).render(e.jsx(a.StrictMode,{children:e.jsx(i,{})}));