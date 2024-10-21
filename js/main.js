function toStringBench(bench) {
    const error = bench.error;
    const hz = bench.hz;
    const stats = bench.stats;
    const size = stats.sample.length;

    if (error) {
        return error;
    } else {
        return (
            formatNumber(hz.toFixed(hz < 100 ? 2 : 0)) + ' ops/sec<br/>' +
            '\xb1' + stats.rme.toFixed(2) + '%<br/>' +
            '(' + size + ' run' + (size === 1 ? '' : 's') + ' sampled)'
        );
    }
}

function formatNumber(number) {
    number = String(number).split('.');

    return number[0].replace(/(?=(?:\d{3})+$)(?!\b)/g, ',') + (number[1] ? '.' + number[1] : '');
}

function new_editor(node){

    editor = ace.edit(node);

    editor.session.setMode("ace/mode/javascript");

    editor.setOption('maxLines', 30);
    editor.setOption('minLines', 4);

    editor.on('change', () => {
        saves();
    });

    return editor;
}

var setup, teardown;
setup_teardown = document.getElementById('ST');

setup = document.createElement('div')
teardown = document.createElement('div')

setup_teardown.appendChild(setup);
setup_teardown.appendChild(teardown);

setup = new_editor(setup);
teardown = new_editor(teardown);

var testcases = new Map();

var tests = document.getElementById('tests');

function new_test(code){
    let main, editor, result;
    main = document.createElement('div');
    editor = document.createElement('div');
    editor.classList.add('editor');
    result = document.createElement('div');
    result.classList.add('result');

    main.appendChild(editor);
    main.appendChild(result);

    editor = new_editor(editor, code);

    testcases.set(editor, result);

    tests.appendChild(main);

    return editor;
}

var loading = false;

function saves(){
    if (loading){
        return
    }

    let save = [];

    for (let editor of testcases.keys()){
        let code = editor.getValue();
        if (code){
            save.push(code);
        }
    }

    let data = window.btoa(
        JSON.stringify({
            'testcases':save,
            'setup':setup.getValue(),
            'teardown':teardown.getValue()
        })
    )

    window.localStorage.setItem('jsLbench', data);

    return data;
}

function loads(data){
    loading = true;

    for (let editor of testcases.keys()){
        let node = editor.container.parentNode;
        node.parentNode.removeChild(node);
    }

    setup.setValue('', 1);
    teardown.setValue('', 1);
    testcases.clear();

    let save;

    try {
        save = JSON.parse(window.atob(data));
    } catch {
        new_test();
        loading = false;
        return;
    }

    if (save){
        setup.setValue(save['setup'], 1)
        teardown.setValue(save['teardown'], 1)

        for (let code of save['testcases']){
            if (code){
                 let editor = new_test();
                editor.setValue(code, 1);
            }
        }
    }

    loading = false;
    saves()
}

import_export.saves = saves;
import_export.loads = loads;
import_export.save_file = 'jsLbench.base64';

function run_tests(){
    let resultElements = {};
    var suite = new Benchmark.Suite('foo', {
        onComplete: function(event){
            targets = event.currentTarget;
            let results = [];
            for (let i=0; i<targets.length; i++){
                result = targets[i];
                if (!result.error)
                    results.push(result)
            }
            results.sort((a,b)=>b.hz-a.hz)

            let fastest = results[0];
            for (result of results){
                if (result === fastest){
                    resultElements[result.name].innerHTML += '<br/>Fastest';
                } else {
                    resultElements[result.name].innerHTML += '<br/>'+(result.hz/fastest.hz).toFixed(2)+'% Speed';
                }
            }
        }
    });

    for (let [editor, result] of testcases){
        result.innerHTML = ""
    }

    var i = 0;
    for (let [editor, result] of testcases){
        i += 1;
        resultElements[i] = result;
        let code = editor.getValue().trim();
        if (code){
            suite.add(i, {
                fn: code,
                setup: setup.getValue().trim(),
                teardown: teardown.getValue().trim(),
                onCycle(evt) {
                    result.innerHTML = toStringBench(evt.target);
                }
            })
        } else {
            result.innerHTML = "Empty Test"
        }
    }

    suite.run({ 'async': true });
    //suite.run();
}

document.getElementById('add_test').onclick = ()=>new_test();
document.getElementById('run_tests').onclick = ()=>run_tests();

loads(window.localStorage.getItem('jsLbench'))