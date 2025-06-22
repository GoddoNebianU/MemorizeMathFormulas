const formulas = {
    高等数学1: String.raw`
\int sec^2xdx=tanx+C
\int csc^2xdx=-cotx+C
\int secxtanxdx=secx+C
\int cscxcotxdx=-cscx+C
\int shxdx=chx+C
\int chxdx=shx+C
\int tanxdx=-ln|cosx|+C
\int cotxdx=ln|sinx|+C
\int secxdx=ln|secx+tanx|+C
\int cscxdx=ln|cscx-cotx|+C
`,
    高等数学2: String.raw`
对弧长的曲线积分=\int_Lf(x,y)ds=\oint_{\alpha}^{\beta}f[\phi(t),\psi(t)]\sqrt{\phi'^2(t)+\psi'^2(t)}dt,\alpha<\beta
对坐标的曲线积分=\int_LP(x,y)dx+Q(x,y)dy=\int_{\alpha}^{\beta}\{P[\phi(t),\psi(t)]\phi'(t)+Q[\phi(t),\psi(t)]\psi'(t)\}dt
格林公式=\iint\limits_{D}(\frac{\partial Q}{\partial x}-\frac{\partial P}{\partial y})dxdy=\oint_LPdx+Qdy
对面积的曲面积分=\iint\limits_{\Sigma} f(x,y,z) ds = \iint\limits_{D_{xy}} f\big[x,y,z(x,y)\big] \sqrt{1+z_x^2(x,y)+z_y^2(x,y)} \, \mathrm{d}x\mathrm{d}y

`,
    线性代数: String.raw`
    
\int cscxdx=ln|cscx-cotx|+C
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