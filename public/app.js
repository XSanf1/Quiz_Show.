const socket = io();
const $ = id => document.getElementById(id);
let state = null, myId = null, isHost = false, myCode = "";
const DEFAULT_POINTS = [100,200,300,400,500];
const starterCategories = [
 {name:"Gaming",questions:[
  {points:100,question:"In welchem Spiel fängt man Pokémon mit Pokébällen?",answer:"Pokémon"},
  {points:200,question:"Wie heißt die Insel, auf der die meisten Kämpfe in Fortnite stattfinden?",answer:"Die Battle-Royale-Insel (der Kartenname ändert sich je nach Kapitel)"},
  {points:300,question:"Wie heißt die Firma, die Grand Theft Auto (GTA) entwickelt und veröffentlicht?",answer:"Rockstar Games"},
  {points:400,question:"Wie heißt Links Prinzessin in der The-Legend-of-Zelda-Reihe?",answer:"Zelda"},
  {points:500,question:"Wie heißt der Standard-Spielmodus in Rocket League, bei dem zwei Teams mit Autos Fußball spielen?",answer:"Soccar"}
 ]},
 {name:"Allgemeinwissen",questions:[
  {points:100,question:"Wie viele Kontinente gibt es im üblichen Sieben-Kontinente-Modell?",answer:"7"},
  {points:200,question:"Welche Stadt liegt an der Bosporus-Meerenge und auf zwei Kontinenten?",answer:"Istanbul"},
  {points:300,question:"Wie heißt die Hauptstadt von Kanada?",answer:"Ottawa"},
  {points:400,question:"Welches Land hat durch seine Überseegebiete die meisten Zeitzonen?",answer:"Frankreich"},
  {points:500,question:"Wie heißt die tiefste bekannte Stelle im Meer, die im Marianengraben liegt?",answer:"Challengertief im Marianengraben"}
 ]},
 {name:"Sport",questions:[
  {points:100,question:"Wie viele Spieler stehen bei einer Basketballmannschaft gleichzeitig auf dem Feld?",answer:"5"},
  {points:200,question:"Wie lang ist ein olympisches Schwimmbecken?",answer:"50 Meter"},
  {points:300,question:"In welcher Sportart gibt es die Wertung 'Ippon'?",answer:"Judo"},
  {points:400,question:"Wie viele Punkte zählt ein Touchdown im American Football vor dem Zusatzversuch?",answer:"6"},
  {points:500,question:"Welche drei Disziplinen gehören zum klassischen Triathlon?",answer:"Schwimmen, Radfahren und Laufen"}
 ]},
 {name:"Filme & Serien",questions:[
  {points:100,question:"Wie heißt die Schule für Hexerei in Harry Potter?",answer:"Hogwarts"},
  {points:200,question:"Wie heißt der Heimatplanet von Superman?",answer:"Krypton"},
  {points:300,question:"Wer führte Regie bei Jurassic Park (1993)?",answer:"Steven Spielberg"},
  {points:400,question:"Wie heißt die fiktive Stadt, in der Batman meistens Verbrechen bekämpft?",answer:"Gotham City"},
  {points:500,question:"Welcher Pixar-Film aus dem Jahr 1995 war der erste vollständig computeranimierte abendfüllende Kinofilm?",answer:"Toy Story"}
 ]},
 {name:"YouTube & Internet",questions:[
  {points:100,question:"Wie nennt man das Vorschaubild eines Videos?",answer:"Thumbnail"},
  {points:200,question:"Wofür steht die Abkürzung 'URL'?",answer:"Uniform Resource Locator"},
  {points:300,question:"Wie nennt man eine absichtlich irreführende Überschrift, die zum Klicken verleiten soll?",answer:"Clickbait"},
  {points:400,question:"Wie nennt man die Anmeldung, bei der man neben dem Passwort noch einen zweiten Nachweis braucht?",answer:"Zwei-Faktor-Authentifizierung (2FA)"},
  {points:500,question:"Wie heißt das sichere Protokoll, das Webseiten verschlüsselt überträgt und in der Adresse mit „https“ beginnt?",answer:"HTTPS"}
 ]},
 {name:"Naturwissenschaften",questions:[
  {points:100,question:"Welches chemische Symbol hat Gold?",answer:"Au"},
  {points:200,question:"Wie heißt der Vorgang, bei dem Pflanzen Lichtenergie in chemische Energie umwandeln?",answer:"Photosynthese"},
  {points:300,question:"Welches Gas macht den größten Anteil der Erdatmosphäre aus?",answer:"Stickstoff"},
  {points:400,question:"Wie nennt man die Einheit der elektrischen Widerstandsmessung?",answer:"Ohm"},
  {points:500,question:"Wie heißt die Grenze eines Schwarzen Lochs, ab der nichts mehr entkommen kann?",answer:"Ereignishorizont"}
 ]},
 {name:"Geschichte",questions:[
  {points:100,question:"In welchem Jahr fiel die Berliner Mauer?",answer:"1989"},
  {points:200,question:"Wie hieß das Schiff, mit dem Charles Darwin seine berühmte Forschungsreise machte?",answer:"HMS Beagle"},
  {points:300,question:"Welche antike Stadt wurde 79 n. Chr. beim Ausbruch des Vesuvs verschüttet?",answer:"Pompeji"},
  {points:400,question:"Wer war der erste Bundeskanzler der Bundesrepublik Deutschland?",answer:"Konrad Adenauer"},
  {points:500,question:"Wie heißt der Friedensschluss von 1648, der den Dreißigjährigen Krieg beendete?",answer:"Westfälischer Friede"}
 ]},
 {name:"Geografie",questions:[
  {points:100,question:"Welcher ist der größte Ozean der Erde?",answer:"Pazifischer Ozean"},
  {points:200,question:"Durch welche Hauptstadt fließt die Donau?",answer:"Unter anderem Wien, Bratislava, Budapest und Belgrad; als Quizantwort gilt Wien (eine der Hauptstädte)."},
  {points:300,question:"Wie heißt die längste Gebirgskette an Land?",answer:"Anden"},
  {points:400,question:"Welches Land hat die Hauptstadt Ulaanbaatar?",answer:"Mongolei"},
  {points:500,question:"Welcher See ist der tiefste der Erde?",answer:"Baikalsee"}
 ]},
 {name:"Musik",questions:[
  {points:100,question:"Wie viele Tasten hat ein gewöhnliches modernes Klavier?",answer:"88"},
  {points:200,question:"Welche Instrumentenfamilie umfasst Trompete und Posaune?",answer:"Blechblasinstrumente"},
  {points:300,question:"Wie nennt man in der Musik die Geschwindigkeit eines Stücks?",answer:"Tempo"},
  {points:400,question:"Welcher Komponist schrieb die Oper 'Die Zauberflöte'?",answer:"Wolfgang Amadeus Mozart"},
  {points:500,question:"Wie nennt man in der Musik den Abstand von einem Ton bis zum nächsthöheren Ton mit gleichem Namen?",answer:"Oktave"}
 ]},
 {name:"Essen & Trinken",questions:[
  {points:100,question:"Aus welcher Frucht werden Rosinen hergestellt?",answer:"Weintrauben"},
  {points:200,question:"Welches Gewürz gibt vielen Currys ihre gelbe Farbe?",answer:"Kurkuma"},
  {points:300,question:"Wie heißt die japanische Paste aus fermentierten Sojabohnen?",answer:"Miso"},
  {points:400,question:"Nenne eine Reissorte, die häufig für Risotto verwendet wird.",answer:"Arborio (auch Carnaroli)"},
  {points:500,question:"Wie heißt der Prozess, bei dem Hefe Zucker in Alkohol und Kohlendioxid umwandelt?",answer:"Gärung"}
 ]}
];
const extraQuestions = {
 Gaming:[
  {points:100,question:"Welches Spiel ist bekannt für das Bauen aus Blöcken und Creeper?",answer:"Minecraft"},
  {points:200,question:"In welchem Spiel fährt man mit Autos und versucht, einen Ball ins Tor zu schießen?",answer:"Rocket League"},
  {points:300,question:"Wie heißt die Währung, mit der man in Fortnite viele kosmetische Gegenstände kauft?",answer:"V-Bucks"},
  {points:400,question:"Wie heißt die Region, in der die ersten Pokémon-Spiele spielen?",answer:"Kanto"},
  {points:500,question:"Wie heißt die Organisation, gegen die man in GTA V unter anderem in der Story ermittelt?",answer:"FIB"}
 ],
 Allgemeinwissen:[
  {points:100,question:"Wie viele Tage hat eine Woche?",answer:"7"},
  {points:200,question:"Wie viele Minuten hat eine Stunde?",answer:"60"},
  {points:300,question:"Welches Organ pumpt Blut durch den menschlichen Körper?",answer:"Das Herz"},
  {points:400,question:"Wie heißt die Währung der Schweiz?",answer:"Schweizer Franken"},
  {points:500,question:"Welches chemische Element hat das Symbol Fe?",answer:"Eisen"}
 ],
 Sport:[
  {points:100,question:"Wie viele Tore stehen beim Fußball auf dem Spielfeld?",answer:"2"},
  {points:200,question:"Wie viele Ringe hat das olympische Symbol?",answer:"5"},
  {points:300,question:"Wie lange dauert ein reguläres Fußballspiel ohne Nachspielzeit?",answer:"90 Minuten"},
  {points:400,question:"In welcher Sportart gibt es einen Aufschlag und einen Smash?",answer:"Zum Beispiel Volleyball oder Badminton"},
  {points:500,question:"Wie lang ist ein Marathon ungefähr?",answer:"42,195 Kilometer"}
 ],
 "Filme & Serien":[
  {points:100,question:"Wie heißt der Schneemann aus Die Eiskönigin?",answer:"Olaf"},
  {points:200,question:"Wie heißt der Zauberer mit der Narbe auf der Stirn?",answer:"Harry Potter"},
  {points:300,question:"Wie heißt der Cowboy aus Toy Story?",answer:"Woody"},
  {points:400,question:"Wie heißt die Heimatwelt von Black Panther?",answer:"Wakanda"},
  {points:500,question:"Wie heißt der Regisseur der Filmtrilogie Der Herr der Ringe?",answer:"Peter Jackson"}
 ],
 "YouTube & Internet":[
  {points:100,question:"Welche Plattform ist vor allem für Videos bekannt?",answer:"YouTube"},
  {points:200,question:"Wie nennt man eine kurze private Nachricht im Internet oft?",answer:"DM / Direktnachricht"},
  {points:300,question:"Wofür steht die Abkürzung WLAN?",answer:"Wireless Local Area Network"},
  {points:400,question:"Wie heißt ein Programm, das Webseiten aufruft und anzeigt?",answer:"Browser"},
  {points:500,question:"Wie nennt man eine betrügerische Nachricht, die Passwörter stehlen soll?",answer:"Phishing"}
 ],
 Naturwissenschaften:[
  {points:100,question:"Welcher Planet ist unser Zuhause?",answer:"Die Erde"},
  {points:200,question:"Bei wie viel Grad Celsius gefriert Wasser ungefähr?",answer:"0 °C"},
  {points:300,question:"Welches Organ brauchen Menschen zum Atmen?",answer:"Die Lunge"},
  {points:400,question:"Wie heißt die Kraft, die Gegenstände zur Erde zieht?",answer:"Schwerkraft / Gravitation"},
  {points:500,question:"Welches Teilchen trägt eine negative elektrische Ladung?",answer:"Elektron"}
 ],
 Geschichte:[
  {points:100,question:"Wie hieß die Mauer, die Berlin bis 1989 teilte?",answer:"Berliner Mauer"},
  {points:200,question:"Welche antike Zivilisation baute die Pyramiden von Gizeh?",answer:"Die alten Ägypter"},
  {points:300,question:"In welchem Jahr begann der Zweite Weltkrieg in Europa?",answer:"1939"},
  {points:400,question:"Wie hieß die erste Frau im Weltall?",answer:"Walentina Tereschkowa"},
  {points:500,question:"Welche Revolution begann 1789 in Frankreich?",answer:"Die Französische Revolution"}
 ],
 Geografie:[
  {points:100,question:"Auf welchem Kontinent liegt Deutschland?",answer:"Europa"},
  {points:200,question:"Wie heißt die Hauptstadt von Italien?",answer:"Rom"},
  {points:300,question:"Welcher Fluss fließt durch London?",answer:"Themse"},
  {points:400,question:"Wie heißt die Hauptstadt von Australien?",answer:"Canberra"},
  {points:500,question:"Welches Gebirge trennt Europa und Asien teilweise?",answer:"Uralgebirge"}
 ],
 Musik:[
  {points:100,question:"Welches Instrument hat normalerweise schwarze und weiße Tasten?",answer:"Klavier"},
  {points:200,question:"Wie viele Saiten hat eine gewöhnliche Gitarre?",answer:"6"},
  {points:300,question:"Aus welchem Land stammt die Band ABBA?",answer:"Schweden"},
  {points:400,question:"Welcher Komponist wurde als 'Wunderkind' bekannt und hieß Wolfgang Amadeus mit Vornamen?",answer:"Mozart"},
  {points:500,question:"Wie nennt man ein Musikstück für ein Soloinstrument mit Orchester?",answer:"Konzert"}
 ],
 "Essen & Trinken":[
  {points:100,question:"Welche Frucht ist die Hauptzutat von Apfelsaft?",answer:"Äpfel"},
  {points:200,question:"Aus welcher Milch wird klassischer Mozzarella häufig hergestellt?",answer:"Kuhmilch oder Büffelmilch"},
  {points:300,question:"Welche Hülsenfrucht ist die Hauptzutat von Hummus?",answer:"Kichererbsen"},
  {points:400,question:"Wie heißt die japanische Suppe, die oft mit Nudeln serviert wird?",answer:"Ramen"},
  {points:500,question:"Welches Gewürz wird aus den getrockneten Narben einer Krokusart gewonnen?",answer:"Safran"}
 ]
};
starterCategories.forEach(category => category.questions.push(...(extraQuestions[category.name] || [])));
function cloneStarter(){return JSON.parse(JSON.stringify(starterCategories));}
function toast(msg){const t=$("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2600);}
function emitCreate(name,password){socket.emit("createRoom",{name,password,categories:cloneStarter()});}
$("createForm").addEventListener("submit",e=>{e.preventDefault();$("lobbyError").textContent="";emitCreate($("hostName").value,$("hostPassword").value);});
$("joinForm").addEventListener("submit",e=>{e.preventDefault();$("lobbyError").textContent="";socket.emit("joinRoom",{name:$("joinName").value,code:$("joinCode").value});});
socket.on("connect",()=>{myId=socket.id;});
socket.on("joined",data=>{myCode=data.code;isHost=data.host;$("lobby").hidden=true;$("game").hidden=false;$("roomLabel").textContent="Spielcode: "+myCode;$("codeDisplay").textContent=myCode;$("roleBadge").textContent=isHost?"SPIELLEITUNG":"SPIELER";$("editBtn").hidden=!isHost;$("resetBtn").hidden=!isHost;$("shuffleBtn").hidden=!isHost;toast(isHost?"Runde erstellt! Teile den Spielcode.":"Du bist im Spiel!");});
socket.on("errorMessage",msg=>{$("lobbyError").textContent=msg;toast(msg);});
socket.on("state",s=>{state=s;render();});
function render(){
 if(!state)return;
 $("notice").textContent=state.message;
 $("codeDisplay").textContent=state.code;
 $("roleBadge").textContent=state.hostId===myId?"SPIELLEITUNG":"SPIELER";
 isHost=state.hostId===myId;
 $("editBtn").hidden=!isHost;$("resetBtn").hidden=!isHost;$("shuffleBtn").hidden=!isHost;
 const boardMode=state.status==="board";
 $("questionScoreRow").hidden=boardMode||!isHost;
 $("boardSection").hidden=!boardMode;
 $("assignRow").hidden=!boardMode||!isHost;
 renderTargetPlayers();$("questionSection").hidden=boardMode;
 renderBoard();renderPlayers();
 if(!boardMode && state.activeQuestion){
  $("questionMeta").textContent=`${state.activeQuestion.category}  •  ${state.activeQuestion.points} PUNKTE`;
  $("questionText").textContent=state.activeQuestion.question;
  const answer = state.hostAnswer || state.activeQuestion.answer;
  $("answerText").textContent=(isHost && !state.answerShown ? "Lösung (nur Spielleitung): " : "Lösung: ") + (answer || "");
  $("answerText").hidden=!(isHost || state.answerShown);
  $("hostControls").hidden=!isHost;
  $("questionScoreRow").hidden=!isHost;
  renderQuestionScorer();
  const winner=state.players.find(p=>p.id===state.buzzWinner);
  $("buzzBtn").disabled=!state.buzzOpen || !!state.buzzWinner || state.hostId===myId || (state.attemptedPlayers||[]).includes(myId);
  $("buzzStatus").textContent=winner?`${winner.name} hat zuerst gebuzzert!`:((state.attemptedPlayers||[]).includes(myId)?"Du hast bei dieser Frage schon falsch geantwortet und bist gesperrt.":state.buzzOpen?"Buzzer ist freigegeben – drück jetzt!":"Warte auf die Freigabe …");
  $("openBtn").disabled=!!state.buzzWinner || state.buzzOpen;
  $("againBtn").hidden=false;
  $("againBtn").textContent="Zurück zur Übersicht";
  $("rightBtn").disabled=!!state.answerShown;
  $("wrongBtn").disabled=!!state.answerShown;
  $("openBtn").disabled=!!state.buzzWinner || state.buzzOpen || !!state.answerShown;
  $("buzzBtn").disabled=!!state.answerShown || !state.buzzOpen || !!state.buzzWinner || state.hostId===myId || (state.attemptedPlayers||[]).includes(myId);
  $("timerBtn").hidden=!isHost;
  $("timerDisplay").hidden=!state.timerEndAt;
 }
 renderTimer();
}
function renderTargetPlayers(){
 const select=$("targetPlayer");
 const current=select.value;
 select.innerHTML="";
 const open=document.createElement("option");open.value="";open.textContent="Offen für alle (Buzzer entscheidet)";select.appendChild(open);
 (state?.players||[]).forEach(p=>{
  const option=document.createElement("option");option.value=p.id;option.textContent=p.name+(p.id===myId?" (du)":"");select.appendChild(option);
 });
 if([...select.options].some(o=>o.value===current))select.value=current;
}
function renderQuestionScorer(){
 const select=$("questionScorer");
 const current=state?.activeQuestion?.assignedPlayerId || state?.buzzWinner || "";
 select.innerHTML="";
 const auto=document.createElement("option");auto.value="";auto.textContent="Automatisch: Buzzer-Gewinner";select.appendChild(auto);
 (state?.players||[]).forEach(p=>{
  const option=document.createElement("option");option.value=p.id;option.textContent=p.name+(p.id===myId?" (du)":"");select.appendChild(option);
 });
 select.value=current;
}
function renderBoard(){
 const board=$("board");board.innerHTML="";
 const pointValues=[100,200,300,400,500];
 state.categories.forEach((cat,ci)=>{
  const h=document.createElement("div");h.className="cathead";h.textContent=cat.name;board.appendChild(h);
 });
 pointValues.forEach(points=>state.categories.forEach((cat,ci)=>{
  const b=document.createElement("button");const used=state.used.includes(`${ci}:${points}`);
  b.className="tile"+(used?" used":"");b.textContent=used?"✓":points;
  b.disabled=used||!isHost||state.status!=="board";
  b.title=`${cat.name} – ${points} Punkte`;
  b.addEventListener("click",()=>socket.emit("selectQuestion",{categoryIndex:ci,points,targetPlayerId:$("targetPlayer").value||null}));
  board.appendChild(b);
 }));
}
function renderPlayers(){
 const box=$("players");box.innerHTML="";
 const sorted=[...state.players].sort((a,b)=>b.score-a.score);
 sorted.forEach((p,i)=>{
  const el=document.createElement("div");el.className="player"+(p.id===myId?" me":"")+(p.id===state.buzzWinner?" winner":"");
  const name=document.createElement("span");name.className="playername";name.textContent=(i===0&&p.score>0?"👑 ":"")+p.name+(p.id===myId?" (du)":"");
  const score=document.createElement(isHost?"button":"span");score.className="playerpoints";score.textContent=p.score.toLocaleString("de-DE");
  if(isHost){
   score.type="button";score.title="Klicken, um den Punktestand direkt zu bearbeiten";score.setAttribute("aria-label",`Punktestand von ${p.name} bearbeiten`);
   score.addEventListener("click",()=>{const value=prompt(`Neuer Punktestand für ${p.name}:`,String(p.score));if(value!==null&&value.trim()!==""){const n=Number(value);if(Number.isFinite(n))socket.emit("setPlayerScore",{playerId:p.id,score:n});else toast("Bitte eine gültige Zahl eingeben.");}});
  }
  el.append(name,score);
  if(isHost){
   const controls=document.createElement("div");controls.className="score-edit-controls";
   const minus=document.createElement("button");minus.type="button";minus.className="small danger";minus.textContent="−100";minus.title="100 Punkte abziehen";minus.addEventListener("click",()=>socket.emit("adjustPlayerScore",{playerId:p.id,delta:-100}));
   const plus=document.createElement("button");plus.type="button";plus.className="small secondary";plus.textContent="+100";plus.title="100 Punkte hinzufügen";plus.addEventListener("click",()=>socket.emit("adjustPlayerScore",{playerId:p.id,delta:100}));
   const edit=document.createElement("button");edit.type="button";edit.className="small secondary";edit.textContent="Ändern";edit.addEventListener("click",()=>{const value=prompt(`Neuer Punktestand für ${p.name}:`,String(p.score));if(value!==null&&value.trim()!=="")socket.emit("setPlayerScore",{playerId:p.id,score:Number(value)});});
   controls.append(minus,plus,edit);el.appendChild(controls);
  }
  box.appendChild(el);
 });
}
$("buzzBtn").addEventListener("click",()=>{socket.emit("buzz");$("buzzBtn").disabled=true;});
$("openBtn").addEventListener("click",()=>socket.emit("openBuzzers"));
$("questionScorer").addEventListener("change",()=>socket.emit("setQuestionScorer",{playerId:$("questionScorer").value||null}));
$("rightBtn").addEventListener("click",()=>socket.emit("judge",{correct:true,playerId:$("questionScorer").value||null}));
$("wrongBtn").addEventListener("click",()=>socket.emit("judge",{correct:false,playerId:$("questionScorer").value||null}));
$("againBtn").addEventListener("click",()=>socket.emit("endQuestion"));
$("timerBtn").addEventListener("click",()=>socket.emit("startTimer"));
let timerInterval=null;
function renderTimer(){ if(timerInterval) clearInterval(timerInterval); const el=$("timerDisplay"); if(!state?.timerEndAt){el.textContent="";el.hidden=true;return;} el.hidden=false; const tick=()=>{const left=Math.max(0,Math.ceil((state.timerEndAt-Date.now())/1000));el.textContent=`⏱ ${Math.floor(left/60)}:${String(left%60).padStart(2,"0")}`;if(left<=0){clearInterval(timerInterval);timerInterval=null;}};tick();timerInterval=setInterval(tick,250); }
$("resetBtn").addEventListener("click",()=>{if(confirm("Punkte und benutzte Fragen wirklich zurücksetzen?"))socket.emit("resetScores");});

$("shuffleBtn").addEventListener("click",()=>{
 if(!isHost || state?.status!=="board") return;
 if(!confirm("Alle Kategorien und sämtliche Fragen mit ihren passenden Lösungen zufällig neu verteilen? Punktstufen bleiben 100–500; benutzte Fragen werden zurückgesetzt.")) return;
 socket.emit("shuffleCategories");
});
$("editBtn").addEventListener("click",()=>{buildEditor();$("editor").hidden=false;$("editor").scrollIntoView({behavior:"smooth"});});
$("closeEditor").addEventListener("click",()=>$("editor").hidden=true);
function buildEditor(){
 const box=$("editorFields");box.innerHTML="";
 state.categories.forEach((cat,ci)=>{
  const wrap=document.createElement("div");wrap.className="editorcat";
  const title=document.createElement("label");title.textContent="Kategorie "+(ci+1);
  const name=document.createElement("input");name.value=cat.name;name.maxLength=28;name.dataset.category=ci;name.dataset.field="name";title.appendChild(name);wrap.appendChild(title);
  cat.questions.forEach((q,qi)=>{
   const row=document.createElement("div");row.className="editorq";
   const pts=document.createElement("label");pts.className="pointslabel";pts.textContent="Punkte";const pointInput=document.createElement("input");pointInput.type="number";pointInput.min="0";pointInput.max="100000";pointInput.step="1";pointInput.value=q.points;pointInput.dataset.category=ci;pointInput.dataset.question=qi;pointInput.dataset.field="points";pts.appendChild(pointInput);row.appendChild(pts);
   [["Frage", "question"],["Lösung","answer"]].forEach(([labelText,field])=>{
    const lab=document.createElement("label");lab.textContent=labelText;
    const input=document.createElement("input");input.value=q[field];input.dataset.category=ci;input.dataset.question=qi;input.dataset.field=field;input.maxLength=300;lab.appendChild(input);row.appendChild(lab);
   });
   wrap.appendChild(row);
  });
  box.appendChild(wrap);
 });
}
$("saveEditor").addEventListener("click",()=>{
 const cats=JSON.parse(JSON.stringify(state.categories));
 $("editorFields").querySelectorAll("input").forEach(inp=>{
  const ci=Number(inp.dataset.category),field=inp.dataset.field;
  if(field==="name")cats[ci].name=inp.value.trim()||`Kategorie ${ci+1}`;
  else if(field==="points") cats[ci].questions[Number(inp.dataset.question)].points=Math.max(0,Math.min(100000,Math.trunc(Number(inp.value)||0)));
  else cats[ci].questions[Number(inp.dataset.question)][field]=inp.value.trim();
 });
 if(cats.some(c=>c.questions.some(q=>!q.question||!q.answer))){toast("Bitte jede Frage und Lösung ausfüllen.");return;}
 socket.emit("editCategories",cats);$("editor").hidden=true;toast("Fragen gespeichert.");
});
