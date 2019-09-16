
$(document).ready(function(){
    /* Popup Event */
    $('.popup').on('click mousedown mousemove mouseup mousewheel', function(e){
        e.stopPropagation();
    })
    $('.popup .close, .popup .btn-close').on('click', function(e){
        closePopup($(this).closest('.popup').attr('id'));
    })


    $('.popup .max-window').on('click', function(e){
        let $pop = $(this).closest('.popup');
        let $popC = $(this).closest('.popup').find('.popup-contents');
        if($pop.hasClass('max-windowed')){
            $pop.removeClass('max-windowed');
            $popC.css('width', $popC.attr('width'));
            $popC.css('height', $popC.attr('height'));
        }else{
            $pop.addClass('max-windowed');
            $popC.css('width', $popC.css('maxWidth'));
            $popC.css('height', $popC.css('maxHeight'));
        }

    })
})

function openPopup(id, callBeforeOpen, callAfterConfirm, data){
    if(!$('#'+id).hasClass('max-windowed')){
        let $c = $('#'+id+' .popup-contents');
        $c.css('width', $c.attr('width'));
        $c.css('height', $c.attr('height'));
    }
    if(callBeforeOpen) callBeforeOpen(id, data);

    $('#'+id).addClass('opening');
    setTimeout(function(){
        $('#'+id).addClass('active');
        $('#'+id).find('.action-msg').addClass('hidden');
    })
    setTimeout(function(){
        $('#'+id).removeClass('opening');
        if($('#'+id).find('input, textarea').length > 0){
            $('#'+id).find('input, textarea')[0].focus();
        }
    }, 150)

    $('#'+id+' .btn-confirm').off('click').on('click', function(){
        if(callAfterConfirm) callAfterConfirm(id, data);
    })

}

function openConfirm(title, msg, callback, buttonText){
    $('#popConfirm .popup-header').html(title || '');
    $('#popConfirm .popup-body').html(msg);
    $('#popConfirm .btn-ok').text(buttonText || '확인');
    $('#popConfirm .btn-ok').off('click').on('click', function(){
        if(callback && callback.confirm){
            closePopup('popConfirm');
            callback.confirm();
        }
    })
    $('#popConfirm .btn-close').off('click').on('click', function(){
        if(callback && callback.cancel){
            callback.cancel();
        }
        closePopup('popConfirm');
    });

    openPopup('popConfirm');

    // $('#popConfirm').addClass('active');
    setTimeout(function(){
        $('#popConfirm .btn-close').focus();
    })
}

function closePopup(id){
    $('#'+id).addClass('closing');
    setTimeout(function(){
        $('#'+id).removeClass('active');
        $('#'+id).removeClass('closing');

    }, 150);
    $('#'+id).removeClass('active');
}

//-------------------------------------------------------------------//
//-------------------------------------------------------------------//
//-------------------------------------------------------------------//
function initLoadData(id){
    $('#'+id).find('#load-data-text').val('');
}

function doLoadData(id, data){
    if(data){
        $('.contents-panel').html(data);
    }else{
        let _val = $('#'+id).find('#load-data-text').val();
        $('.contents-panel').html(_val);
    }
    Data.refresh();
    Tree.clickTrigger('fo', [true, true]);
    closePopup(id);
}

function initPopStyle(id){
    let editor;
    if($('#'+id+' .pop-textarea + .CodeMirror').length > 0){
        editor = $('#'+id+' .pop-textarea + .CodeMirror')[0].CodeMirror;
    }

    if($('#style-sass').length > 0){
        $('#'+id+' .pop-textarea').val($('#style-sass').html().trim());
    }else{
        $('#'+id+' .pop-textarea').val('');
        if(editor){
            setTimeout(function(){
                editor.setValue('');
                editor.clearHistory();
                editor.clearGutter();
            })
        }
    }
    setTimeout(function(){
        if(!editor){
            editor = CodeMirror.fromTextArea($('#'+id+' .pop-textarea')[0], {
                tabSize: 4,
                indentUnit: 4,
                mode: 'text/x-scss'
            });
            editor.on('keydown', function(instance, event){
                switch(event.keyCode){
                    case 83:
                        if(event.ctrlKey){
                            $('#'+id+' .btn-confirm').trigger('click');
                            event.preventDefault();
                            event.stopPropagation();
                        }
                }
            });
        }
        editor.focus();
        editor.setCursor(editor.lineCount(), 0);
    })
}
function confirmPopStyle(id){
    let editor = $('#'+id+' textarea + .CodeMirror')[0].CodeMirror;
    if($('#style-customize').length === 0){
        $('.face-scale-viewport').prepend('<style id="style-customize"></style>');
    }
    if($('#style-sass').length === 0){
        $('.face-scale-viewport').prepend('<style id="style-sass"></style>');
    }

    $('#style-sass').html(editor.getValue());
    var sass = new Sass();
    sass.options({
        // Format output: nested, expanded, compact, compressed
        style: Sass.style.compressed,
    })
    sass.compile(editor.getValue(), function(result) {
        console.log(result);
        if(result.status === 0){
            $('#style-customize').html(result.text);
        }else{
            alert(result.formatted);
        }
    });


    // $('#style-customize').html(editor.getValue());
    closePopup(id);
}

function initPopAni(id){
    let editor;
    if($('#'+id+' .pop-textarea + .CodeMirror').length > 0){
        editor = $('#'+id+' .pop-textarea + .CodeMirror')[0].CodeMirror;
        console.log(editor);
    }

    if($('#style-keyframes').length > 0){
        $('#'+id+' .pop-textarea').val($('#style-keyframes').html().trim());
    }else{
        $('#'+id+' .pop-textarea').val('');
        if(editor){
            setTimeout(function(){
                editor.setValue('');
                editor.clearHistory();
                editor.clearGutter();
            })
        }
    }
    setTimeout(function(){
        if(!editor){
            editor = CodeMirror.fromTextArea($('#'+id+' .pop-textarea')[0], {
                tabSize: 4,
                indentUnit: 4,
            });
            editor.on('keydown', function(instance, event){
                switch(event.keyCode){
                    case 83:
                        if(event.ctrlKey){
                            $('#'+id+' .btn-confirm').trigger('click');
                            event.preventDefault();
                            event.stopPropagation();
                        }
                }
            });
        }
        editor.focus();
        editor.setCursor(editor.lineCount(), 0);
    })


    $('.btn-load-ani').off('click').on('click', function(){
        $.ajax({
            url: "css/keyframes.css",
            dataType: "text",
            success: function(txt) {
                // $('#'+id+' .pop-textarea').val($('#'+id+' .pop-textarea').val() + '\n' + txt);

                // let doc = editor.getDoc();
                // let cursor = editor.getDoc().getCursor();
                // doc.replaceRange(txt, cursor);

                editor.setValue(editor.getValue() + '\n' + txt);
                setTimeout(function(){
                    editor.refresh();
                })
                // editor.focus();
                // editor.setCursor(editor.lineCount(), 0);
            },
            error: function(e){
                alert('keyframes.css를 가져올 수 없습니다');
            }
        });
    })

}
function confirmPopAni(id){
    let editor;
    if($('#'+id+' .pop-textarea + .CodeMirror').length > 0){
        editor = $('#'+id+' .pop-textarea + .CodeMirror')[0].CodeMirror;
    }

    if($('#style-keyframes').length === 0){
        $('.face-scale-viewport').prepend('<style id="style-keyframes"></style>');
    }
    $('#style-keyframes').html(editor.getValue());
    closePopup(id);
}

function initPopHtml(id){

    $('#'+id+' .popup-header span').text(' - ' + Face.selectedFace.attr('id'));
    let editor;
    if($('#'+id+' .pop-textarea + .CodeMirror').length > 0){
        editor = $('#'+id+' .pop-textarea + .CodeMirror')[0].CodeMirror;
    }

    setTimeout(function(){
        if(!editor){
            editor = CodeMirror.fromTextArea($('#'+id+' .pop-textarea')[0], {
                tabSize: 4,
                indentUnit: 4,
                mode: 'htmlmixed'
            });

            editor.on('keydown', function(instance, event){
                switch(event.keyCode){
                    case 83:
                        if(event.ctrlKey){
                            $('#'+id+' .btn-confirm').trigger('click');
                            event.preventDefault();
                            event.stopPropagation();
                        }
                }
            });
        }

        if(Face.selectedFace.html().length > 0){
            $('#'+id+' .pop-textarea').val(Face.selectedFace.html().trim());
            editor.setValue(Face.selectedFace.html().trim());
        }else{
            $('#'+id+' .pop-textarea').val('');
            editor.setValue('');
            editor.clearHistory();
            editor.clearGutter();
        }

        editor.focus();
        editor.setCursor(editor.lineCount(), 0);
    })


}
function confirmPopHtml(id){
    let editor = $('#'+id+' .pop-textarea + .CodeMirror')[0].CodeMirror;
    Face.selectedFace.html(editor.getValue());
    closePopup(id);
}

function initPopImageData(id, data){
    //image-data-text
    $('#image-data-text').val(data);
    $('#'+id+' .action-msg').addClass('hidden');

    $('#'+id+' .btn-copy').off('click').on('click', function(){
        $('#image-data-text')[0].select();
        document.execCommand("copy");
        $('#'+id+' .action-msg').removeClass('hidden');
    })
}

function confirmPopImageData(id, data){
}


















/****************************************/
