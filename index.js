const formulas = {
    高等数学1: String.raw`
%%
\int \sec^2 x \, \mathrm{d}x == \tan x + C
%%
\int \csc^2 x \, \mathrm{d}x == -\cot x + C
%%
\int \sec x \tan x \, \mathrm{d}x == \sec x + C
%%
\int \csc x \cot x \, \mathrm{d}x == -\csc x + C
%%
\int \sinh x \, \mathrm{d}x == \cosh x + C
%%
\int \cosh x \, \mathrm{d}x == \sinh x + C
%%
\int \tan x \, \mathrm{d}x == -\ln|\cos x| + C
%%
\int \cot x \, \mathrm{d}x == \ln|\sin x| + C
%%
\int \sec x \, \mathrm{d}x == \ln|\sec x + \tan x| + C
%%
\int \csc x \, \mathrm{d}x == \ln|\csc x - \cot x| + C
%%
`,
    高等数学2: String.raw`
%%
对弧长的曲线积分||
\int_L f(x,y) \, \mathrm{d}s
==\int_\alpha^\beta f[\phi(t),\psi(t)] \sqrt{\phi'^2(t) + \psi'^2(t)} \, \mathrm{d}t, \quad \alpha < \beta


%%
对坐标的曲线积分||
\int_L P(x,y) \, \mathrm{d}x + Q(x,y) \, \mathrm{d}y
==\int_\alpha^\beta \left\{P[\phi(t),\psi(t)] \phi'(t) + Q[\phi(t),\psi(t)] \psi'(t)\right\} \, \mathrm{d}t

%%
格林公式||
\iint\limits_D \left(\frac{\partial Q}{\partial x} - \frac{\partial P}{\partial y}\right) \mathrm{d}x \mathrm{d}y
==\oint_L P \, \mathrm{d}x + Q \, \mathrm{d}y

%%
对面积的曲面积分||
\iint\limits_\Sigma f(x,y,z) \, \mathrm{d}S
==\iint\limits_{D_{xy}} f\big[x,y,z(x,y)\big] \sqrt{1 + z_x^2(x,y) + z_y^2(x,y)} \, \mathrm{d}x \mathrm{d}y

%%
对坐标的曲面积分||
\iint\limits_\Sigma R(x,y,z) \, \mathrm{d}x\mathrm{d}y
==\iint\limits_{D_{xy}}R[x,y,z(x,y)] \, \mathrm{d}x\mathrm{d}y

%%
高斯公式||
\iiint\limits_{\Omega} \left( \frac{\partial P}{\partial x} + \frac{\partial Q}{\partial y} + \frac{\partial R}{\partial z} \right) \mathrm{d}V
==O\iint\limits_{\Sigma} \left( P \mathrm{d}y \mathrm{d}z + Q \mathrm{d}z \mathrm{d}x + R \mathrm{d}x \mathrm{d}y \right)

%%
斯托克斯公式||
\iint_{\Sigma} \left(
  \left(\frac{\partial R}{\partial y} - \frac{\partial Q}{\partial z}\right) \mathrm{d}y\mathrm{d}z +
  \left(\frac{\partial P}{\partial z} - \frac{\partial R}{\partial x}\right) \mathrm{d}z\mathrm{d}x +
  \left(\frac{\partial Q}{\partial x} - \frac{\partial P}{\partial y}\right) \mathrm{d}x\mathrm{d}y
\right) == \oint_{\partial \Sigma} P\mathrm{d}x + Q\mathrm{d}y + R\mathrm{d}z
%%

傅里叶级数
==\frac{a_0}{2}+\sum_{n=1}^\infty(a_n \cos nx + b_n \sin nx)

%%


傅里叶级数a_n
==\frac{1}{\pi}\int_{-\pi}^{\pi} f(x) \cos nx \, \mathrm{d}x

%%

傅里叶级数b_n
==\frac{1}{\pi}\int_{-\pi}^{\pi} f(x) \sin nx \, \mathrm{d}x


`,
    线性代数: String.raw`

`,
    大学物理: String.raw`

`};

function loadFormulas(index) {
    console.log('loading', index)
    const result = [];
    // for (let two of formulas[index].trim().split('\n')) {
    //     let ones = two.split('=');
    //     if (ones.length === 3) {
    //         [ones[0], ones[1], ones[2]] = [ones[1], ones[2], ones[0]]
    //     }
    //     result.push(ones);
    // } 数学范围8-12章
    let parts = formulas[index].split('%%')
                               .filter(v=>v.trim() !== '')
                               .map(v=>v.replace('\n', '')
                                        .trim());
    for (let part of parts) {
        let three = null;
        if (part.includes('||')) {
            const spt = part.split('||')
                            .map(v=>v.trim());
            three = spt[0];
            part = spt[1];
        }

        let ones = part.split('==')
                       .map(v=>v.trim());
        if (three !== null)
            ones.push(three);
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