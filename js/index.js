const formulas = {};

const __DEBUG__ = false;

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
        .filter(v => v.trim() !== '')
        .map(v => v.replace('\n', '')
            .trim());

    if (__DEBUG__) parts.reverse();
    for (let part of parts) {
        let three = null;
        if (part.includes('||')) {
            const spt = part.split('||')
                .map(v => v.trim());
            three = spt[0];
            part = spt[1];
        }

        let ones = part.split('==')
            .map(v => v.trim());
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

const counter_f = (() => {
    let i = -1;
    return {
        last: () => {
            i--;
            if (i < 0)
                i += formulasArr.length;
            return i;
        },
        next: () => {
            i = (i + 1) % formulasArr.length;
            return i;
        },
        reset: () => {
            i = -1;
        },
        getIndex: () => {
            return i + 1;
        }
    }
})();

function rerender() {
    MathJax.typesetPromise([mathP, mathPT]).then(() => { }).catch(_ => { });
}

function next() {
    nowQA = formulasArr[counter_f.next()];
    fresh();
}

function last() {
    nowQA = formulasArr[counter_f.last()];
    fresh();
}

function fresh() {
    mathP.innerText = String.raw`\(` + nowQA[0] + String.raw`\)`;
    mathPT.innerText = '\\(' + counter_f.getIndex() + '. ' + (nowQA.length === 3 ? nowQA[2] : '') + '\\)';
    rerender();
    answerShowed = false;

    if (__DEBUG__) showAnswer();
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
    counter_f.reset();
    document.getElementById('formula-set-name').innerText = setName;
    window.formulasArr = loadFormulas(setName);
    next();
}

function addSelection(name) {
    const newP = document.createElement('p');
    const newLabel = document.createElement('label');
    const newInput = document.createElement('input');
    const newSpan = document.createElement('span');

    newInput.setAttribute('name', 'group1');
    newInput.setAttribute('type', 'radio');
    newInput.addEventListener('click', () => {
        selectFormulas(name);
    });

    newSpan.innerText = name;

    newLabel.appendChild(newInput);
    newLabel.appendChild(newSpan);

    newP.appendChild(newLabel);

    selectForm.appendChild(newP);
}

// for (const label of selectForm.children) {
//     label.children[0].children[0].addEventListener('click', (e) => {
//         selectFormulas(label.children[0].children[1].innerText);
//     });
// }

window.onload = () => {
    fetch('./formulas/formulas.json')
        .then(response => response.json())
        .then(data => {
            // for (const formulaSet of data) {
            //     addSelection(formulaSet['name']);

            //     fetch(formulaSet['url'])
            //         .then(response => response.text())
            //         .then(text => {
            //             formulas[formulaSet['name']] = text;
            //         });
            // }

            const fetchPromises = data.map(item =>
                fetch(item['url'])
                    .then(response => response.text())
                    .then(text => {
                        formulas[item['name']] = text;
                        addSelection(item['name']);
                    })
            )

            return Promise.all(fetchPromises);
        })
        .then(() => {
            if (__DEBUG__)
                selectFormulas('高等数学1');
        });

    addEventListener('keydown', (ev) => {
        const action = {
            'n': next,
            'l': last,
            'Enter': () => answerShowed ? (next(), updateCounter()) : showAnswer(),
        }[ev.key];
        if (action) action();
    });
}