let r=document.getElementById("task");
const questions = "http://localhost:8080/questions/";
let l;
const submitData = (e) => {
  e.preventDefault();

console.log("je suis au debut");
  let option;
var radios = document.getElementsByName( "OP" );
    for( i = 0; i < radios.length; i++ ) {
        if( radios[i].checked ) {
    option=radios[i].value;
console.log("op-1="+radios[i].value);
console.log("op0="+option);
            
        }
    }	
console.log("op="+option);
	if (option === "S") {
console.log("je suis dans s");
    l = "http://localhost:8080/surveys/1";
  } else if (option === "B") {
console.log("je suis dans s");
    l = "http://localhost:8080/surveys/2";
  } 
console.log("je suis avec une pas de fetch");
   fetch(l)
    .then((response) => response.json())
    .then((sd) => {
      const r = document.getElementById("task");
      
      r.innerHTML = `
        <div>
          <h2>${sd.id}</h2>
          <h2>${sd.title}</h2>
          <h2>${sd.desc}</h2>
        </div>
      `;
	const q = sd.qs;
      q.forEach((qId) => {
        console.log(qId);
        fetch(
          `${ questions }${qId}`
        )
          .then((response) => response.json())
          .then((qd) => {
            r.innerHTML += `<h3>${qd.title}</h3>
			    <p>${qd.description}</p>`;
            if (qd.type === "rate") {
              r.innerHTML += 
              `<select>
                <option value=""></option>
                ${qd.options.map(
                  (option) => `<option value="${option}">${option}</option>`
                )}
              </select>`;
            } else if (qd.type === "free") {
              r.innerHTML += `<input type="text" placeholder="Enter your answer">`;
            }
          });
      });
    })
    .catch((error) => console.log(error));
}