const formulas = {
    高等数学1: String.raw`
\int \sec^2 x \, dx = \tan x + C
\int \csc^2 x \, dx = -\cot x + C
\int \sec x \tan x \, dx = \sec x + C
\int \csc x \cot x \, dx = -\csc x + C
\int \sinh x \, dx = \cosh x + C
\int \cosh x \, dx = \sinh x + C
\int \tan x \, dx = -\ln|\cos x| + C
\int \cot x \, dx = \ln|\sin x| + C
\int \sec x \, dx = \ln|\sec x + \tan x| + C
\int \csc x \, dx = \ln|\csc x - \cot x| + C
`,
    高等数学2: String.raw`
对弧长的曲线积分 = \int_L f(x,y) \, ds = \int_\alpha^\beta f[\phi(t),\psi(t)] \sqrt{\phi'^2(t) + \psi'^2(t)} \, dt, \quad \alpha < \beta
对坐标的曲线积分 = \int_L P(x,y) \, dx + Q(x,y) \, dy = \int_\alpha^\beta \left\{P[\phi(t),\psi(t)] \phi'(t) + Q[\phi(t),\psi(t)] \psi'(t)\right\} \, dt
格林公式 = \iint\limits_D \left(\frac{\partial Q}{\partial x} - \frac{\partial P}{\partial y}\right) dx dy = \oint_L P \, dx + Q \, dy
对面积的曲面积分 = \iint\limits_\Sigma f(x,y,z) \, dS = \iint\limits_{D_{xy}} f\big[x,y,z(x,y)\big] \sqrt{1 + z_x^2(x,y) + z_y^2(x,y)} \, dx dy
`,
    线性代数: String.raw`

`,
    大学物理: String.raw`

`};

function loadFormulas(index) {
    console.log('loading', index)
    const result = [];
    for (let two of formulas[index].trim().split('\n')) {
        let ones = two.split('=');
        if (ones.length === 3) {
            [ones[0], ones[1], ones[2]] = [ones[1], ones[2], ones[0]]
        }
        result.push(ones);
    }
    return result;
}

const mathP = document.getElementById('mathP');
const mathPT = document.getElementById('mathPT');
const counter = document.getElementById('counter');
const selectForm = document.getElementById('formula-select');
let answerShowed = false;
let nowQA = null;

function rerender() {
    MathJax.typesetPromise([mathP]).then(() => { }).catch(_ => { });
}

function next() {
    nowQA = formulasArr[Math.floor(Math.random() * formulasArr.length)];
    mathP.innerText = String.raw`\(` + nowQA[0] + String.raw`\)`;
    mathPT.innerText = nowQA.length === 3 ? nowQA[2] : '';
    rerender();
    answerShowed = false;
}

function showAnswer() {
    if (answerShowed || nowQA === null) return;
    mathP.innerText = String.raw`\(` + nowQA[0] + '=' + nowQA[1] + String.raw`\)`;
    rerender();
    answerShowed = true;
}

function updateCounter() {
    counter.innerText = String(Number(counter.innerText) + 1);
}

function selectFormulas(setName) {
    document.getElementById('formula-set-name').innerText = setName;
    window.formulasArr = loadFormulas(setName);
    next();
}

for (const label of selectForm.children) {
    label.children[0].children[0].addEventListener('click', (e) => {
        selectFormulas(label.children[0].children[1].innerText);
    });
}

window.onload = () => {
    selectForm.children[1].children[0].children[0].click();
}