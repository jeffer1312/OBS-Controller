const obs = new OBSWebSocket();

document.getElementById('address_button').addEventListener('click', e => {
    const address = document.getElementById('address').value;
    // const password = document.getElementById('password').value;

    obs.connect({
        address: address,
        //  password: password
    });
});
document.getElementById('back').addEventListener('click', e => {
    $('.scenes').css('display', 'block');
    $('.transmission').css('display', 'block');
    $('.back').css('display', 'none');
    $('.sources').css('display', 'none');
    $('.transmission').css('display', 'block');
    $('#source_list').html('');

})

obs.on('ConnectionOpened', () => {

    //verificar se ja esta iniciado

    obs.send('GetStreamingStatus').then(data => {
        const streamDiv = document.getElementById('stream');
        const streamElement = document.createElement('button');
        let on = data.streaming;
        if (on == true) {
            streamElement.textContent = 'Transmitindo';
            streamElement.className = 'transmission-on'
            $('.transmission-on').css('background-color', 'green');

        } else {
            streamElement.textContent = 'Parado';
            streamElement.className = 'transmission-off'
            $('.transmission-off').css('background-color', 'red');
        }
        //
        //clicar no status

        streamElement.onclick = function() {
            if (on == true) {
                on = false;
                streamElement.className = 'transmission-off'
                $('.transmission-off').css('background-color', 'red');


            } else {
                on = true;
                streamElement.className = 'transmission-on'
                $('.transmission-off').css('background-color', 'green');

            }

            obs.send('StartStopStreaming');
        }





        streamDiv.appendChild(streamElement);

    })




    //colocar as cenas e as fontes na tela
    $('.connect').css('display', 'none');
    $('.scenes').css('display', 'block');
    $('.transmission').css('display', 'block');
    obs.send('GetSceneList').then(data => {


        const sceneListDiv = document.getElementById('scene_list');
        const sourceListDiv = document.getElementById('source_list');

        data.scenes.forEach(scene => {
            const sceneElement = document.createElement('button')
            sceneElement.className = 'btn-scenes';
            sceneElement.textContent = scene.name;

            sceneElement.onclick = function() {
                obs.send('SetCurrentScene', {
                    'scene-name': scene.name,
                });

                const sources = scene.sources;
                if (sources != 0) {

                    sources.forEach(source => {
                        let visibles = source.render;
                        const sourceElement = document.createElement('button')
                        if (visibles == true) {
                            sourceElement.className = 'btn-desativado'
                            $('.btn-desativado').css('background-color', 'red');

                        } else {
                            sourceElement.className = 'btn-ativado'
                            $('.btn-ativado').css('background-color', 'green');
                        }

                        //sourceElement.className = 'btn-sources';


                        sourceElement.textContent = source.name;
                        sourceElement.onclick = function() {
                            if (visibles == true) {
                                visibles = false;
                                sourceElement.className = 'btn-desativado'
                                $('.btn-desativado').css('background-color', 'red');


                            } else {
                                visibles = true;
                                sourceElement.className = 'btn-ativado'
                                $('.btn-ativado').css('background-color', 'green');

                            }

                            obs.send('SetSceneItemProperties', {
                                'item': source.name,
                                'visible': visibles,
                            });
                        }





                        sourceListDiv.appendChild(sourceElement);
                    });
                    $('.scenes').css('display', 'none');
                    $('.sources').css('display', 'block');
                    $('.back').css('display', 'block');





                }


            };

            sceneListDiv.appendChild(sceneElement);


        });

    })

});