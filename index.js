const formulas = String.raw
    `\(\int sec^2xdx=tanx+C\)<br>
\(\int csc^2xdx=-cotx+C\)<br>
\(\int secxtanxdx=secx+C\)<br>
\(\int cscxcotxdx=-cscx+C\)<br>
\(\int shxdx=chx+C\)<br>
\(\int chxdx=shx+C\)<br>
\(\int tanxdx=-ln|cosx|+C\)<br>
\(\int cotxdx=ln|sinx|+C\)<br>
\(\int secxdx=ln|secx+tanx|+C\)<br>
\(\int cscxdx=ln|cscx-cotx|+C\)<br>`;

let formulasArr = [];
for(let two of formulas.split('\n')) {
    let ones = two.split('=');
    ones[0] = ones[0].slice(2);
    ones[1] = ones[1].slice(0, -6);
    formulasArr.push(ones);
}

const mathP = document.getElementById('mathP');

let answerShowed = false;
let nowQA = null;

function rerender() {
    MathJax.typesetPromise([mathP]).then(()=>{}).catch(_=>{});
}

function next() {
    nowQA = formulasArr[Math.floor(Math.random() * formulasArr.length)];
    mathP.innerText = String.raw`\(` + nowQA[0] + String.raw`\)`;
    rerender();
    answerShowed = false;
}

function showAnswer() {
    if(answerShowed || nowQA===null) return;
    mathP.innerText = String.raw`\(` + nowQA[0] + '=' + nowQA[1] + String.raw`\)`;
    rerender();
    answerShowed = true;
}