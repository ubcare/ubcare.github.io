'use strict';
function Slider(options){
    let $$ = this;
    let _isPointerClicked = false;

    let $slider = $(options.selector);
    let $template =$(
        '<div class="slider-wrap">'+
            '<div class="back-bar"></div>'+
            '<div class="bar"><div class="pointer"></div></div>'+
        '</div>');
    $slider.html($template);
    $slider.attr('title', options.title || '');

    let $backBar = $slider.find('.back-bar');
    let $bar = $slider.find('.bar');
    let $pointer = $slider.find('.pointer');


    let _backBarWidth = $backBar.width();
    let _minVal = $slider.attr('minVal');
    let _maxVal = $slider.attr('maxVal');

    $(document)
        .on('mousemove',function(e){
            if(_isPointerClicked){
                $$.setPointer($bar.width() + e.originalEvent.movementX);
                // console.log(e.originalEvent.movementX);
            }
        })
        .on('mouseup', function(e){
            if(_isPointerClicked){
                _isPointerClicked = false;
            }
        })
    $pointer
        .on('mousedown',function(e){
            if(e.which === 1){
                _isPointerClicked = true;
            }
            e.stopPropagation();
        })

    $backBar
        .on('mousedown', function(e){
            if(e.which === 1){
                $$.setPointer(e.offsetX);
            }
            e.stopPropagation();
        });

    $bar
        .on('mousedown', function(e){
            if(e.which === 1){
                $$.setPointer(e.offsetX);
            }
            e.stopPropagation();
        });



    $$.setPointer = function(px){
        if(px <= _backBarWidth && px >= 0){
            $bar.css('width', px);
            // $pointer.css('left', px);
            let val =parseFloat(parseFloat(_minVal) + parseFloat((_maxVal - _minVal) * (px / _backBarWidth))).toFixed(2);
            $slider.attr('val', val);
            options.pointChanged(val);
        }
    };

    $$.setValue = function(val){
        $$.setPointer(_backBarWidth * (val / _maxVal));
    }


    $$.setValue(parseFloat($slider.attr('val')));


}
