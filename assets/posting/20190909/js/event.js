
$(document).ready(function(){

    var mouseLeftClicked = mouseRightClicked = mouseWheelClicked = false;
    var splitVerticalLeftClicked = splitHorizontalLeftClicked = false;

    $(window).on('beforeunload', function(){
        Storage.set('cachedHtmlData', $('.body-panel .contents-panel').html());
    })
    /* Prevent Default Context Menu */
    $('body').on('contextmenu', function() {
        return false;
    })
    $('.main .header-panel .logo').on('click', function(e){
        window.location.reload();
    })

    /* Key Events */
    $(document)
        .keydown(function(e){
            // console.log(e.keyCode);
            switch(e.keyCode){
                case 37: // arrow-left
                    if($('.body-panel').hasClass('view-mode')){
                        $('.view-mode-move-prev').trigger('click');
                    }
                    break;
                case 39: // arrow-right
                    if($('.body-panel').hasClass('view-mode')){
                        $('.view-mode-move-next').trigger('click');
                    }
                    break;


                case 90: // z
                    if(e.ctrlKey && !e.shiftKey){ // Ctrl + z ; Undo
                        let obj = History.undo();
                        Face.changeFaceByStyle($('#'+obj.id), obj.style);
                        e.preventDefault();
                    }
                    else if(e.ctrlKey && e.shiftKey){ // Ctrl + Shift + z ; Redo
                        let obj = History.redo();
                        Face.changeFaceByStyle($('#'+obj.id), obj.style);
                        e.preventDefault();
                    }
                    break;

                case 89: // y
                    if(e.ctrlKey){
                        let obj = History.redo();
                        Face.changeFaceByStyle($('#'+obj.id), obj.style, true);
                        e.preventDefault();
                    }
                    break;

                case 83: // s
                    if(e.ctrlKey){
                        saveData();
                        e.preventDefault();
                        e.stopPropagation();
                    }
                    break;

                case 79: // o
                    if(e.ctrlKey){
                        openPopup('popLoad', initLoadData, doLoadData);
                        e.preventDefault();
                        e.stopPropagation();
                    }
                    break;

                // case 78: // n
                //     if(e.ctrlKey){
                //         console.log(123);
                //         // newPage();
                //         e.preventDefault();
                //         e.stopPropagation();
                //         return;
                //     }
                //     break;

                case 69: // e
                    if(e.ctrlKey){
                        exportData();
                        e.preventDefault();
                        e.stopPropagation();
                    }
                    break;

                case 113: // F2 css수정
                    if(!$('#popStyle').hasClass('active')){
                        openPopup('popStyle', initPopStyle, confirmPopStyle);
                    }

                    break;

                case 114: // F3 keyframe 수정
                    if(!$('#popAni').hasClass('active')){
                        openPopup('popAni', initPopAni, confirmPopAni);
                    }
                    e.preventDefault();
                    e.stopPropagation();
                    break;

                case 115: // F4 html수정
                    if(Face.selectedFace && Face.selectedFace.hasClass('face')){
                        if(!$('#popHtml').hasClass('active')){
                            openPopup('popHtml', initPopHtml, confirmPopHtml);
                        }
                    }else{
                        alert('face인 경우만 html수정이 가능합니다');
                    }
                    e.preventDefault();
                    e.stopPropagation();
                    break;
                case 118: // F7 slide show
                    slideShow();
                    break;

            }
        });

    /* Mouse Events */
    var _facePos = {};
    var _detailPanelWidth = $('.detail-panel').outerWidth();
    var _faceListHeight = $('.detail-panel .face-list').outerHeight();

    // 모든 input에 undo redo 기능 막음
    $('input, textarea').on('keydown', function(e){
        if(e.ctrlKey){
            if(e.keyCode === 89 || e.keyCode === 90){
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        }
    })

    $('.contents-panel').on('mousedown', function(e){
        if(!$('.body-panel').hasClass('view-mode')){
            _facePos = Face.getFacePos(Face.selectedFace);
            if(e.which === 1) mouseLeftClicked = true;
            else if(e.which === 2) mouseWheelClicked = true;
            else if(e.which === 3) mouseRightClicked = true;
            else{
                mouseLeftClicked = false;
                mouseRightClicked = false;
            }
        }

    });
    $(document).on('mousemove', function(e){
        if(mouseLeftClicked){
            if(e.shiftKey){
                _facePos.rz += e.originalEvent.movementX / 5;
            }else{
                _facePos.ry += e.originalEvent.movementX / 5;
                _facePos.rx -= e.originalEvent.movementY / 5;
            }
            Util.makeInteger(_facePos)
            Face.transformFace(Face.selectedFace, _facePos);
        }
        if(mouseRightClicked){
            if(e.shiftKey){
                _facePos.tz -= e.originalEvent.movementY / 2;
            }else{
                _facePos.tx += e.originalEvent.movementX / 2;
                _facePos.ty += e.originalEvent.movementY / 2;
            }
            Face.transformFace(Face.selectedFace, _facePos);
        }
        if(mouseWheelClicked){
            if(e.ctrlKey){
                Face.zoom(parseInt(e.originalEvent.movementY) > 0, 0.01)
            }
        }
        if(splitVerticalLeftClicked){
            _detailPanelWidth -= e.originalEvent.movementX;
            if(_detailPanelWidth < 200) _detailPanelWidth = 200;

            $('.detail-panel').css('width', _detailPanelWidth);
        }

        if(splitHorizontalLeftClicked){
            _faceListHeight += e.originalEvent.movementY;
            if(_faceListHeight < 100) _faceListHeight = 100;
            $('.detail-panel .face-list').css('height', _faceListHeight);
        }
		//e.preventDefault();
		e.stopPropagation();
		//return false;
    });
    $(document).on('mouseup', function(e){
        if(mouseLeftClicked === true){
            History.stack(Face.selectedFace);
            mouseLeftClicked = false;
        }
        if(mouseRightClicked === true){
            History.stack(Face.selectedFace);
            mouseRightClicked= false;
        }
        if(mouseWheelClicked === true){
            mouseWheelClicked = false;
        }
        if(splitVerticalLeftClicked === true){
            splitVerticalLeftClicked = false;
            Storage.set('detailPanelWidth', _detailPanelWidth);
        }
        if(splitHorizontalLeftClicked === true){
            splitHorizontalLeftClicked = false;
            Storage.set('faceListHeight', _faceListHeight);
        }

        return false;
    });

    //moving split-bar
    $('.split-bar.vertical').on('mousedown', function(e){
        splitVerticalLeftClicked = true;
    })
    $('.split-bar.horizontal').on('mousedown', function(e){
        splitHorizontalLeftClicked = true;
    })

    // subtitle toggle click
    $('.detail-panel .subtitle').click(function(){
        if($(this).hasClass('active')){
            $(this).find('+ ul').slideUp(200);
        }else{
            $(this).find('+ ul').slideDown(200);
        }
        $(this).toggleClass('active');
    })

    //input-info change Events
    $('.face-info .input-info')
        .on('keydown', function(e){
            if(e.keyCode === 13){  // enter
                $(e.target).trigger('blur');
            }
        })
        .on('blur', function(e){
            DetailInfo.changeInfo($(e.target));
        })

    //input-realtime change Events
    $('.face-info .input-realtime:not(textarea)')
        .on('keydown', function(e){
            if(e.keyCode === 38){ // arrow-up
                let val = parseFloat(parseFloat($(e.target).val()) + (e.altKey ? (0.1) : (e.shiftKey ? 10 : (e.ctrlKey ? 100 : 1)))).toFixed(1);
                $(e.target).val(parseFloat(val));
                DetailInfo.changeTransform();
            }
            else if(e.keyCode === 40){ // arrow-down
                let val = parseFloat(parseFloat($(e.target).val()) - (e.altKey ? (0.1) : (e.shiftKey ? 10 : (e.ctrlKey ? 100 : 1)))).toFixed(1);
                $(e.target).val(parseFloat(val));
                DetailInfo.changeTransform();
            }
            else if(e.keyCode === 13){  // enter
                $(e.target).trigger('blur');
            }
        })
        .on('blur', function(e){
            DetailInfo.changeTransform();
        })
    //input-realtime textbox change Events
    $('.face-info textarea.input-realtime')
        .on('keydown', function(e){
            if((e.keyCode === 186 && !e.shiftKey) || e.keyCode === 13){ // 186 without shift:semi-colon, 13:enter
                setTimeout(function(){
                    DetailInfo.changeStyle(true);
                })
            }else{
                setTimeout(function(){
                    DetailInfo.changeStyle(false);
                });
            }
        })

    //textarea 사이즈 변경 감지
    setInterval(function(){
        $('#input-style').each(function(i,e){
            Storage.set('textareaStyleHeight', $(e).outerHeight());
        })
    }, 1000);

    $('.popup').keydown(function(e){

        switch(e.keyCode){
            case 27: // ESC
                closePopup($(e.target).closest('.popup.active').attr('id'));
            break;
        }

        e.stopPropagation();
    })

    /**************** view mode *****************/
    $('.view-mode-toggle').click(function(){
        Face.frontViewReset();
    })
    $('.view-mode-move-next').click(function(){
        Tree.getNextSlideFace();
    })
    $('.view-mode-move-prev').click(function(){
        Tree.getPrevSlideFace();
    })
    //********************************************//


    // Tree Visibility Toggle
    $('.face-visible-toggle').click(function(){
        $('.face-list').toggleClass('toggle-visibility-on');
    })

    // Tree Slide Toggle
    $('.face-slide-toggle').click(function(){
        $('.face-list').toggleClass('toggle-slide-on');
    })



    //********************************************//

})

function sample(deg){
    Draw.drawSphere(deg);
    Data.init();
}
function sampleLine(deg){
    Draw.drawSphereLine(deg);
    Data.init();
}
function test(){
    Tree.addFace('fg_2');
}
