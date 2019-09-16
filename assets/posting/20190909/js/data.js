const Regex = {
    Transform: /transform:(.+?);/g,
    RotateX: /(rotateX\()(-?)\d+(\.?)\d*(?=deg)?/gi,
    RotateY: /(rotateY\()(-?)\d+(\.?)\d*(?=deg)?/gi,
    RotateZ: /(rotateZ\()(-?)\d+(\.?)\d*(?=deg)?/gi,
    TranslateX: /(translateX\()(-?)\d+(\.?)\d*(?=px)?/gi,
    TranslateY: /(translateY\()(-?)\d+(\.?)\d*(?=px)?/gi,
    TranslateZ: /(translateZ\()(-?)\d+(\.?)\d*(?=px)?/gi,
    Scale: /(scale\()(-?)\d+(\.?)\d*(?=\))?/gi,
    // Scale: /(?<=scale\()(-?)\d+(\.?)\d+?(?=deg)?/g,
}

// const Regex_bak = {
//     Transform: /transform:(.+?);/g,
//     RotateX: /(?<=rotateX\()(-?)\d+(\.?)\d*(?=deg)?/gi,
//     RotateY: /(?<=rotateY\()(-?)\d+(\.?)\d*(?=deg)?/gi,
//     RotateZ: /(?<=rotateZ\()(-?)\d+(\.?)\d*(?=deg)?/gi,
//     TranslateX: /(?<=translateX\()(-?)\d+(\.?)\d*(?=px)?/gi,
//     TranslateY: /(?<=translateY\()(-?)\d+(\.?)\d*(?=px)?/gi,
//     TranslateZ: /(?<=translateZ\()(-?)\d+(\.?)\d*(?=px)?/gi,
//     Scale: /(?<=scale\()(-?)\d+(\.?)\d*(?=\))?/gi,
// }

const Data = {
    _history: {},
    _tree: {},
    init: function(){
        History.init();
        Face.init();
        Tree.init();
    },
    refresh: function(){
        this.init();
    }
};

const Draw = {
    drawSphere: function(deg){
        let tz = 150;
        let w = Math.tan((deg/2) * (Math.PI/180)) * tz * 2 + 1;
        let faceCount = 180/deg;
        let a = 1;

        let newId = Util.makeNewId();
        let $fo = $('<div class="face-observer sample" id="fo"></div>')
        $('.face-scale-viewport').html('');
        $('.face-scale-viewport').attr('sc', '1').attr('style', '');
        $('.face-scale-viewport').append($fo);

        $fo.append('<div class="face-group" id="'+newId+'"></div>')
        for(i=0; i<faceCount ; i++){
            for(j=0; j<faceCount ; j++){
                $('#'+newId).append('<div id="sg'+i+'_'+j+'" class="face sp" style="transform: rotateX('+(i*deg + (deg/2)) * a+'deg) rotateY('+(j*deg + (deg/2)) * a
                    +'deg) rotateZ(0deg) translateZ('+tz+'px); width:'+w+'px;height:'+w+'px;"></div>');
            }
        }

        a = -1;
        for(i=0; i<faceCount ; i++){
            for(j=0; j<faceCount ; j++){
                $('#'+newId).append('<div id="sg'+i+'_'+j+'" class="face sp" style="transform: rotateX('+(i*deg + (deg/2)) * a+'deg) rotateY('+(j*deg + (deg/2)) * a
                +'deg) rotateZ(0deg) translateZ('+tz+'px); width:'+w+'px; height:'+w+'px;"></div>');
            }
        }
    },

    drawSphereLine: function(deg){
        let newId = Util.makeNewId();

        let $fo = $('<div class="face-observer sample" id="fo"></div>')
        $('.face-scale-viewport').html('');
        $('.face-scale-viewport').attr('sc', '1').attr('style', '');
        $('.face-scale-viewport').append($fo);


        $fo.append('<div class="face-group" id="'+newId+'" title="구모양1"></div>')

        for(i=1 ; i<=180/deg ; i++){
            $('#'+newId).append('<div class="face round" id="'+newId+'_'+i+'" style="transform: rotateX('+(deg*i)+'deg)"></div>');
            $('#'+newId).append('<div class="face round" id="'+newId+'_y'+i+'" style="transform: rotateY('+(deg*i)+'deg)"></div>');
        }

    },

    drawTest: function(id){
        let deg = 30;
        $('#'+id).html('');
        for(i=1 ; i<=3 ; i++){
            $('#'+id).append('<div class="face round" id="'+id+'_'+i+'" rx="'+(deg*i)+'"></div>');
        }
    },

    drawTest2_1: function(){
        let $e = $('#test2');
        let pos = Face.getFacePos($e);
        let pos2 = {
            rx: -pos.rx,
            ry: -pos.ry,
            rz: -pos.rz,
            tx: -pos.tx,
            ty: -pos.ty,
            tz: -pos.tz,
        }
    }
}

const History = {
    init: function(){
        Data._history = {};
        Data._history._index = {
            pointer: 0,
            isUndo: false,
            isRedo: false,
            list: [],
        };
        $('.face, .face-group, .face-observer').each(function(i, e){
            if($(e).attr('id')){
                History.add($(e).attr('id'));
            }
        })
    },
    add: function(id){
        Data._history[id] = {
            pointer: 0,
            // isUndo: false,
            // isRedo: false,
            list: [],
        }
        Data._history[id].list.push($('#'+id).attr('style') || 'transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg) translateX(0px) translateY(0px) translateZ(0px);')
    },
    stack: function($e){
        let hisIdx = Data._history._index;
        let id = $e.attr('id');
        let his = Data._history[id];
        let style = $e.attr('style');
        if(!his) return;

        if(hisIdx.isUndo || hisIdx.isRedo){
            hisIdx.list = hisIdx.list.slice(0, hisIdx.pointer);
            hisIdx.isUndo = false;
            hisIdx.isRedo = false;

            for(let key in Data._history){
                if(key !== '_index' && Data._history[key].pointer < Data._history[key].list.length - 1){
                    Data._history[key].list = Data._history[key].list.slice(0, Data._history[key].pointer + 1);
                }
            }
        }

        Data._history._index.pointer++;
        Data._history._index.list.push(id);

        //동일값 아닌것만 넣음
        if(JSON.stringify(his.list[his.list.length - 1]) != JSON.stringify(style))
        {
            his.list.push(style);
            his.pointer++;
        }
    },
    undo: function(){
        let hisIdx = Data._history._index;
        if(hisIdx.pointer > 0) hisIdx.pointer--;
        let id = hisIdx.list[hisIdx.pointer];

        hisIdx.isUndo = true;
        hisIdx.isRedo = false;

        let his = Data._history[id];
        if(his.pointer > 0){
            his.pointer--;
        }
        return {id: id, style: his.list[his.pointer]};
    },
    redo: function(){
        let hisIdx = Data._history._index;
        if(hisIdx.pointer < hisIdx.list.length) hisIdx.pointer++;
        let id = hisIdx.list[hisIdx.pointer - 1];

        hisIdx.isUndo = false;
        hisIdx.isRedo = true;

        let his = Data._history[id];
        if(his.pointer < his.list.length - 1){
            his.pointer++;
        }
        return {id: id, style: his.list[his.pointer]};
    }
}

const Face = {
    selectedFace: null,
    scaleView: null,
    observView: null,
    isViewMode: false,
    viewModeFoStyle: '',
    viewModeFSVScale: '',

    init: function(){
        this.scaleView = $('.face-scale-viewport');
        Face.observView = $('#fo');
    },
    selectFace: function($e, preventHighlight){
        this.selectedFace = $e;
        if(!preventHighlight){
            if($e.hasClass('face') || $e.hasClass('face-group')){
                $('.face-highlight').removeClass('face-highlight');
                $e.addClass('face-highlight')
                setTimeout(function(){
                    $e.removeClass('face-highlight')
                },2000)
            }
        }
        DetailInfo.initValue($e);
    },
    getFacePos: function($e){
        let style = $e.attr('style');
        return {
            rx: parseFloat(Regex.RotateX.test(style) ? style.match(Regex.RotateX)[0].replace(/rotatex\(/gi,'') : 0),
            ry: parseFloat(Regex.RotateY.test(style) ? style.match(Regex.RotateY)[0].replace(/rotatey\(/gi,'') : 0),
            rz: parseFloat(Regex.RotateZ.test(style) ? style.match(Regex.RotateZ)[0].replace(/rotatez\(/gi,'') : 0),
            tx: parseFloat(Regex.TranslateX.test(style) ? style.match(Regex.TranslateX)[0].replace(/translatex\(/gi,'') : 0),
            ty: parseFloat(Regex.TranslateY.test(style) ? style.match(Regex.TranslateY)[0].replace(/translatey\(/gi,'') : 0),
            tz: parseFloat(Regex.TranslateZ.test(style) ? style.match(Regex.TranslateZ)[0].replace(/translatez\(/gi,'') : 0),
        };
    },
    frontViewFace: function($face, isCoverSlide){
        $('.body-panel').addClass('view-mode');
        if($('#view-mode-style').length == 0){
            $('.body-panel').prepend('<style id="view-mode-style"></style>');
        }

        new Slider({
            selector: '.view-controls .slider',
            title: 'opacity',
            pointChanged : function(val){
                let regex = /\.face:not\(\.viewing\){opacity: .+ !important}/gi;
                let css = $('#view-mode-style').html();
                if(regex.test(css)){
                    $('#view-mode-style').html(css.replace(/\.view-mode \.face:not\(\.viewing\){opacity: .+ !important}/gi, '.view-mode .face:not(.viewing){opacity: '+val+' !important}'))
                }else{
                    $('#view-mode-style').append('\.view-mode \.face:not(.viewing){opacity: '+val+' !important}');
                }

            }
        });

        if(isCoverSlide){
            //시작 시 style 정보 저장
            if(!this.isViewMode){
                this.isViewMode = true;
                this.viewModeFoStyle = Face.observView.attr('style') || '';
                let s = Face.scaleView.attr('style');
                if(Regex.Scale.test(s)){
                    this.viewModeFSVScale = parseFloat(Face.scaleView.attr('style').match(Regex.Scale)[0].replace(/scale\(/gi,''));
                }else{
                    this.viewModeFSVScale = 1;
                }
            }
            this.slideShowCover();
        }else{
            let transform = "";
            var fn = function($e){
                if(/face-observer/.test($e.attr('class'))){
                    return;
                }else{
                    let style = $e.attr('style');
                    let pos = {};
                    pos.rx = parseFloat(Regex.RotateX.test(style) ? style.match(Regex.RotateX)[0].replace(/rotatex\(/gi,'') : 0),
                    pos.ry = parseFloat(Regex.RotateY.test(style) ? style.match(Regex.RotateY)[0].replace(/rotatey\(/gi,'') : 0),
                    pos.rz = parseFloat(Regex.RotateZ.test(style) ? style.match(Regex.RotateZ)[0].replace(/rotatez\(/gi,'') : 0),
                    pos.tx = parseFloat(Regex.TranslateX.test(style) ? style.match(Regex.TranslateX)[0].replace(/translatex\(/gi,'') : 0),
                    pos.ty = parseFloat(Regex.TranslateY.test(style) ? style.match(Regex.TranslateY)[0].replace(/translatey\(/gi,'') : 0),
                    pos.tz = parseFloat(Regex.TranslateZ.test(style) ? style.match(Regex.TranslateZ)[0].replace(/translatez\(/gi,'') : 0),
                    transform += Face._makeCssTransform(pos, true) + ' ';
                    fn($e.parent());
                }
            }
            fn($face);

            $('.face, .face-group').removeClass('viewing');
            $face.addClass('viewing');
            DetailInfo.initValue($face);
            Face.frontViewTrans(transform);
        }

    },
    frontViewTrans: function(transform){

        Face.observView.css('transform', transform);

        let scaleVal = 1;
        let windowPad = 50;
        // 화면보다 클 경우에는 scale 조정
        if($('#view-mode-fit').is(":checked")){
            let _w = ($('.contents-panel').outerWidth() - (windowPad * 2)) / Face.selectedFace.outerWidth();
            let _h = ($('.contents-panel').outerHeight() - (windowPad * 2)) / Face.selectedFace.outerHeight();
            if(_w > _h) scaleVal = _h;
            else scaleVal = _w;
        }

        Face.frontViewScale(scaleVal);

    },
    slideShowCover: function(test){
        Face.observView.attr('style', this.viewModeFoStyle);
        Face.frontViewScale(this.viewModeFSVScale);
        $('.face, .face-group').addClass('viewing');
    },
    frontViewReset: function(){
        Face.observView.attr('style', this.viewModeFoStyle);
        Face.frontViewScale(this.viewModeFSVScale);

        viewModeFoStyle = '';
        viewModeFSVScale = 1;
        this.isViewMode = false;

        $('#view-mode-style').remove();
        setTimeout(function(){
            $('.face, .face-group').addClass('viewing-closing');
        })
        let timer = Face.scaleView.css('transition-duration').match(/\d*(.*?)\d+/g)[0];
        setTimeout(function(){
            $('.body-panel').removeClass('view-mode');
            $('.face, .face-group').removeClass('viewing-closing');
            $('.face, .face-group').removeClass('viewing');
            DetailInfo.initValue(Face.selectedFace);
        }, parseFloat(timer)*1000)
    },
    frontViewScale: function(val){
        Face.scaleView.css('transform', 'scale('+val+')');
    },
    transformFace: function($e, pos, save){
        $e.css('transform', Face._makeCssTransform(pos));
        DetailInfo.setValueByPos(pos);
    },
    changeFaceByStyle: function($e, style){
        $e.attr('style', style);
        if($e.attr('id') === Face.selectedFace.attr('id')){
            DetailInfo.setValueFromStyle(style);
        }
    },
    _makeCssTransform: function(pos, forFrontView){
        if(forFrontView){
            return ''+
                'translateZ('+(-pos.tz)+'px) '+
                'translateY('+(-pos.ty)+'px) '+
                'translateX('+(-pos.tx)+'px) '+
                'rotateZ('+(-pos.rz)+'deg) '+
                'rotateY('+(-pos.ry)+'deg) '+
                'rotateX('+(-pos.rx)+'deg) ';
        }else{
            return ''+
                'rotateX('+pos.rx+'deg) '+
                'rotateY('+pos.ry+'deg) '+
                'rotateZ('+pos.rz+'deg) '+
                'translateX('+pos.tx+'px) '+
                'translateY('+pos.ty+'px) '+
                'translateZ('+pos.tz+'px) ';
        }
    },
    zoom: function(isZoomOut, multiple){
        let _scVal = 1;
        if(Regex.Scale.test(this.scaleView.attr('style'))){
            _scVal = parseFloat(this.scaleView.attr('style').match(Regex.Scale)[0].replace(/scale\(/gi, ''));
        }
        if(isZoomOut) _scVal -= (1 * multiple);
        else _scVal += (1 * multiple);
        if(_scVal <= 0) _scVal = 0.01;

        _scVal = parseFloat(Math.round(_scVal * 100) / 100);
        this.scaleView.css('transform', 'scale('+_scVal+')');
    }
}

const Tree = {

    init: function(){
        Data._tree = {
            id: '',
            children: [],
        };
        Tree._makeData('.face-scale-viewport', Data._tree.children);
        this._makeList();

        this._bindEvents();
    },
    _makeData: function(parent, arr){
        $(parent).find('> .face-observer, > .face-group, > .face').each(function(i, e){
            if($(e)[0].offsetParent){
                let newObj = Tree._makeNewData($(e), arr);
                Tree._makeData('#'+newObj.id, newObj.children);
            }
        })
    },
    _makeNewData: function($e, parentArr, insertAt){
        let attrs = {};
        let newObj = {
            id: $e.attr('id'),
            parent: $e.parent().attr('id'),
            hidden: $e.hasClass('hidden'),
            slide: $('#'+ $e.attr('id')).hasClass('slide'),
            children: [],
        };
        parentArr.splice(insertAt || parentArr.length, 0, newObj)
        return newObj;
    },
    _makeList: function(){
        let fn = function(parentHtml, childArr){
            childArr.forEach(function(e, i){
                let li = Tree._getTemplateOfList($('#'+e.id), e);
                parentHtml.append(li);
                // let isActive = $('#'+li.attr('face-id')).hasClass('face-group') ? '' : 'active';
                isActive = 'active';
                if(e.children.length > 0){
                    let ul = li
                        .addClass('has-sub '+ isActive)
                        .prepend('<div class="toggle"></div>')
                        .append('<ul></ul>')
                        .find('> ul');

                    fn(ul, e.children);
                }
            })
        }
        $('.face-list > ul').html('');
        fn($('.face-list > ul'), Data._tree.children);

    },
    _bindEvents: function(){
        // 하위 리스트 펼치기
        $('.face-list ul li.has-sub .toggle').off('mousedown').on('mousedown', function(e){
            $(e.target).parent().toggleClass('active');
            return false;
        });

        // 리스트 id 클릭
        $('.face-list ul li > p').off('mousedown').on('mousedown', Tree._clickListItem);

        $('.face-list > ul').off('mousedown').on('mousedown', this._openContext);

        // 컨텍스트 메뉴 밖 클릭
        $('#tree-context').off('mousedown').on('mousedown', function(e){
            $('#tree-context').removeClass('active');
            e.stopPropagation();
        })
        $('#tree-context ul').off('mousedown').on('mousedown', function(e){
            e.stopPropagation();
        })

        // list drag & drop
        let _dragElement;
        $('.face-list li').off('dragstart').on('dragstart', function(e){
            _dragElement = $(e.target).closest('li');
            e.stopPropagation();
        })
        $('.face-list li').off('dragover').on('dragover', function(e){
            if($('#'+$(e.target).closest('li').attr('face-id')).hasClass('face')){
                $(e.target).closest('li').find('> p').css('background', '')
            }else{
                $(e.target).closest('li').find('> p').css('background', '#feffcf')
            }
            e.preventDefault();
        });
        $('.face-list li').off('dragenter').on('dragenter', function(e){
            e.preventDefault();
        });
        $('.face-list li').off('dragleave').on('dragleave', function(e){
            $(e.target).closest('li').find('> p').css('background', '')
            e.preventDefault();
        });
        $('.face-list li').off('drop').on('drop', function(e){
            $(e.target).closest('li').find('> p').css('background', '')

            Tree._moveListTo(_dragElement, $(e.target).closest('li'))
            e.stopPropagation();
            e.preventDefault();
        })

        // toggle visibility
        $('.face-list .toggle-visibility input').off('mousedown').on('mousedown', function(e){
            e.stopPropagation();
            return false;
        })
        $('.face-list .toggle-visibility input').off('change').on('change', function(){
            let $li = $(this).closest('li');
            let checked = $(this).is(':checked');
            Tree.changeFaceVisibility($li.attr('face-id'), checked);

            if($li.hasClass('has-sub')){
                $li.find('ul .toggle-visibility input').each(function(i, e){
                    $(e).prop('checked', checked);
                    Tree.changeFaceVisibility($(e).closest('li').attr('face-id'), checked);
                })
            }
        })

        // toggle slide
        $('.face-list .toggle-slide input').off('mousedown').on('mousedown', function(e){
            e.stopPropagation();
            return false;
        })
        $('.face-list .toggle-slide input').off('change').on('change', function(){
            let $li = $(this).closest('li');
            let checked = $(this).is(':checked');
            Tree.changeFaceSlideCheck($li.attr('face-id'), checked);

            // if($li.hasClass('has-sub')){
            //     $li.find('ul .toggle-slide input').each(function(i, e){
            //         $(e).prop('checked', checked);
            //         Tree.changeFaceSlideCheck($(e).closest('li').attr('face-id'), checked);
            //     })
            // }
        })

    },
    changeFaceSlideCheck: function(faceId, checked){
        if(checked){
            $('#'+faceId).addClass('slide');
        }else{
            $('#'+faceId).removeClass('slide');
        }
        Util.findObjById(Data._tree, faceId).slide = checked;
        if(faceId === Face.selectedFace.attr('id')){
            // let c = $('.face-info #input-class').val() + ' slide';
            $('.face-info #input-class').val($('#'+faceId).attr('class'));
        }
    },
    changeFaceVisibility: function(faceId, checked){
        if(checked){
            $('#'+faceId).removeClass('hidden');
        }else{
            $('#'+faceId).addClass('hidden');
        }
        Util.findObjById(Data._tree, faceId).hidden = !checked;
        if(faceId === Face.selectedFace.attr('id')){
            // let c = $('.face-info #input-class').val();
            // $('.face-info #input-class').val(c.replace(/\shidden/, ''));
            $('.face-info #input-class').val($('#'+faceId).attr('class'));
        }
    },
    _moveListTo: function($ele1, $ele2){

        //validation
        if($ele1.attr('id') === $ele2.attr('id')) return;
        if($('#'+$ele2.attr('face-id')).hasClass('face')) {
            alert('face안에는 넣을 수 없습니다');
            return;
        }

        //change tree data
        let fromParentObj = Util.findObjById(Data._tree, $ele1.parent('ul').parent('li').attr('face-id'));
        let droppedObj = Util.findObjById(Data._tree, $ele1.attr('face-id'));
        let toParentObj = Util.findObjById(Data._tree, $ele2.attr('face-id'));


        // toParentObj.children.push(droppedObj);
        fromParentObj.children.forEach(function(e, i){
            if(!e){
                debugger;
            }
            if(e.id === droppedObj.id){
                fromParentObj.children.splice(i, 1);
                return false;
            }
        })
        toParentObj.children = [droppedObj].concat(toParentObj.children);

        if(fromParentObj.children.length === 0){
            $('#_list_'+fromParentObj.id).removeClass('has-sub').removeClass('active');
        }

        //change html body
        $('#'+$ele1.attr('face-id')).detach().prependTo($('#'+$ele2.attr('face-id')));

        //change tree list
        if($ele2.find('> ul').length == 0){
            $ele2
                .addClass('has-sub '+ isActive)
                .prepend('<div class="toggle"></div>')
                .append('<ul></ul>');

        }
        $ele1.detach().prependTo($ele2.find('> ul'));

        this._bindEvents();

    },
    clickTrigger: function(id, params){
        $('#_list_'+ id + ' > p').trigger('mousedown', params);
    },
    _clickListItem: function(e, forceLeftClick, preventHighlight, preventView){

        if(e.which === 1 || e.which === 3 || forceLeftClick){ // mouse left click
            $('.face-info .input-info').trigger('blur');
            $(e.target).closest('.face-list').find('li > p.selected').removeClass('selected');
            $(e.target).closest('li').find('> p').addClass('selected');
            Face.selectFace($('#'+$(e.target).closest('li').attr('face-id')), preventHighlight);
            Storage.set('selectedFaceId', $(e.target).closest('li').attr('face-id'));

            if(Face.isViewMode && !preventView){
                Face.frontViewFace(Face.selectedFace);
            }

        }
    },
    _openContext: function(e){
        if(e.which === 3){ // mouse right click
            $('#tree-context ul').css({top: e.originalEvent.clientY, left: e.originalEvent.clientX})
            if($(window).width() < e.originalEvent.clientX + $('#tree-context ul').width()){
                $('#tree-context ul').css({left: $(window).width() - $('#tree-context ul').width() - 20} )
            }
            Tree._setContextItem();
            $('#tree-context').addClass('active');
        }
    },
    _setContextItem: function(){

        $('#tree-context ul *[class*="context-item"]').show();

        if(Face.selectedFace.attr('id') == Face.observView.attr('id')){
            $('#tree-context ul .context-item-view-face').hide();
            $('#tree-context ul .context-item-copy-append').hide();
            $('#tree-context ul .context-item-delete').hide();
        }
        if(Face.selectedFace.hasClass('face')){
            $('#tree-context ul .context-item-add').hide();
        }
        if(Face.selectedFace.hasClass('face-group')){
            if(!Face.selectedFace.hasClass('slide')){
                $('#tree-context ul .context-item-view-face').hide();
            }
            $('#tree-context ul .context-item-mod-html').hide();
        }
        if(!Face.selectedFace.hasClass('face')){
            $('#tree-context ul .context-item-mod-html').hide();
        }
    },

    Context: {
        editInnerHtml: function(e){
            openPopup('popHtml', initPopHtml, confirmPopHtml);
            $(e).closest('.context-layer').removeClass('active');
        },
        addFaceChild: function(e, type){
            let newId = Util.makeNewId(type == 1 ? 'group' : 'face');
            let $newFace = $('<div class="'+(type == 1 ? 'face-group' : 'face')+'" id="'+newId+'"></div>');
            Face.selectedFace.append($newFace);
            Tree._addData(Face.selectedFace.attr('id'), newId);
            History.add(newId);
            Tree._bindEvents();

            $(e).closest('.context-layer').removeClass('active');
        },
        deleteListItem: function(e){
            $(e).closest('.context-layer').removeClass('active');
            openConfirm('삭제 확인', '해당 Face 및 하위 Face를 삭제하시겠습니까?', {
                confirm: function(){
                    Tree.deleteData();
                }
            })
        },
        frontViewFace: function(e){
            $(e).closest('.context-layer').removeClass('active');

            Face.frontViewFace(Face.selectedFace);
        },
        makeClone: function(e){
            let newIds = [];
            let $parent = Face.selectedFace.parent();
            let $clonedFace = Face.selectedFace.clone();
            $clonedFace.removeClass('face-highlight');

            console.log($clonedFace.html());

            let _tempId = Util.makeNewId($clonedFace.attr('id'));
            $clonedFace.attr('id', _tempId);
            newIds.push(_tempId);

            $clonedFace.find('.face-group, .face').each(function(i, e){
                _tempId = Util.makeNewId($(e).attr('id'));
                $(e).attr('id', _tempId);
                newIds.push(_tempId);
            });
            $parent.append($clonedFace);

            console.log($clonedFace.html());


            newIds.forEach(function(newId){
                Tree._addData($('#'+newId).parent().attr('id'), newId);
                History.add(newId);
            })
            Tree._bindEvents();

            $(e).closest('.context-layer').removeClass('active');
        }
    },

    getNextSlideFace: function(){
        let $face = Face.selectedFace;
        let $nextFace;
        let isNext = false;

        if($face.attr('id') == 'fo'){
            $nextFace = $('.slide').first();
        }else{
            $('.slide').each(function(i, e){
                if(isNext){
                    $nextFace = $(e);
                    return false;
                }
                if($(e).attr('id') === $face.attr('id')){
                    isNext = true;
                }
            })
        }

        if(!$nextFace){
            $nextFace = null;
            Tree.clickTrigger('fo', [true, true]);
            Face.slideShowCover();
            return;
        }
        Tree.clickTrigger($nextFace.attr('id'), [true, true, true]);
        Face.frontViewFace(Face.selectedFace);
    },
    getPrevSlideFace: function(){
        let $face = Face.selectedFace;
        let $prevFace;
        let isPrev = false;

        if($face.attr('id') == 'fo'){
            $prevFace = $('.slide').last();
        }else{
            $('.slide').each(function(i, e){
                if($(e).attr('id') === $face.attr('id')){
                    isPrev = true;
                }
                if(isPrev){
                    $prevFace = $($('.slide')[i-1]);
                    return false;
                }
            })
        }
        if(!$prevFace || $prevFace.length === 0){
            // $prevFace = $('.slide').last();
            $prevFace = null;
            Tree.clickTrigger('fo', [true, true]);
            // Face.frontViewReset();
            Face.slideShowCover();
            return;
        }

        Tree.clickTrigger($prevFace.attr('id'), [true, true]);
        Face.frontViewFace(Face.selectedFace);

    },
    deleteData: function(){
        let faceId = Face.selectedFace.attr('id');

        //remove tree list
        $('#_list_'+faceId).remove();

        //remove tree data
        let parentId = $('#'+faceId).parent().attr('id');
        let parentObj = Util.findObjById(Data._tree, parentId);
        parentObj.children.forEach(function(e, i){
            if(e.id === faceId){
                parentObj.children.splice(i, 1);
                return false;
            }
        })

        //remove face element
        let newSelectList;
        if($('#'+faceId).next().length > 0){
            newSelectList = $('#_list_'+ $('#'+faceId).next().attr('id'));
        }else if($('#'+faceId).prev().length > 0){
            newSelectList = $('#_list_'+ $('#'+faceId).prev().attr('id'));
        }else{
            newSelectList = $('#_list_'+ $('#'+faceId).parent().attr('id'));
        }
        Tree._clickListItem({target: newSelectList[0]}, true )
        $('#'+faceId).remove();

        //remove history data
        delete Data._history[faceId];
    },
    _addData: function(parentId, newId, frontId){
        let parentObj = Util.findObjById(Data._tree, parentId);
        let insertAt = parentObj.children.length;
        if(frontId){
            let i;
            for(i=0 ; i<parentObj.children.length ; i++){
                if(parentObj.children[i].id === frontId) break;
            }
            insertAt = i+1;
        }
        Tree._makeNewData($('#'+newId), parentObj.children, insertAt);

        this._addTreeList(parentObj.id, newId, insertAt);

    },
    _addTreeList: function(parentId, newId, insertAt){

        let $ul = $('#_list_'+parentId+' > ul');
        let $li = Tree._getTemplateOfList($('#'+newId));

        if($ul.length === 0){
            let $toggle = $('<div class="toggle"></div>');
            $ul = $('<ul></ul>');
            $('#_list_'+parentId).append($toggle).append($ul).addClass('has-sub active');
            $ul.append($li);
        }else{
            if($ul.children().length === 0){
                $ul.append($li);
            }else{
                $li.insertAfter($ul.find('> li:last-child'));
            }
        }

    },
    _getTemplateOfList: function($e, obj){
        return $(
            '<li draggable="true" id="_list_'+$e.attr('id')+'" face-id="'+$e.attr('id')+'">'
                +'<p>'
                    +'<i>'+$e.attr('id')+'</i>'
                    +'<span class="face-name" title="'+($e.attr('title') || '')+'">'+($e.attr('title') || '')+'</span>'
                    +'<label class="toggle-slide"><input type="checkbox" '+(obj && obj.slide?'checked="checked"':'')+'></label>'
                    +'<label class="toggle-visibility"><input type="checkbox" '+(obj && obj.hidden?'':'checked="checked"')+'></label>'
                +'</p>'

            +'</li>'
        );
    },

}

const DetailInfo = {
    initValue: function($e){
        let data = Util.findObjById(Data._tree, $e.attr('id'));
        if(!data) return;

        $('.input-info').each(function(i, input){
            let attrName = $(input).attr('id').replace('input-', '');
            switch(attrName){
                case 'class':
                    $(input).val($e.attr(attrName).replace('face-highlight', ''));
                    break;

                case 'id':
                    if(data.id === Face.observView.attr('id')){
                        $(input).attr('disabled', 'disabled');
                    }else{
                        $(input).removeAttr('disabled');
                    }
                default:
                    $(input).val($e.attr(attrName) || '');

            }
        })

        DetailInfo.setValueFromStyle($e.attr('style') || '');


    },
    setValueByPos: function(pos){
        for(let key in pos){
            $('#input-'+ key).val(pos[key] || (key == 'style' ? '' : 0));
        }
    },
    setValueFromStyle: function(style){
        $('#input-rx').val(parseFloat(Regex.RotateX.test(style) ? style.match(Regex.RotateX)[0].replace(/rotatex\(/gi, '') : 0));
        $('#input-ry').val(parseFloat(Regex.RotateY.test(style) ? style.match(Regex.RotateY)[0].replace(/rotatey\(/gi, '') : 0));
        $('#input-rz').val(parseFloat(Regex.RotateZ.test(style) ? style.match(Regex.RotateZ)[0].replace(/rotatez\(/gi, '') : 0));
        $('#input-tx').val(parseFloat(Regex.TranslateX.test(style) ? style.match(Regex.TranslateX)[0].replace(/translatex\(/gi, '') : 0));
        $('#input-ty').val(parseFloat(Regex.TranslateY.test(style) ? style.match(Regex.TranslateY)[0].replace(/translatey\(/gi, '') : 0));
        $('#input-tz').val(parseFloat(Regex.TranslateZ.test(style) ? style.match(Regex.TranslateZ)[0].replace(/translatez\(/gi, '') : 0));
        $('#input-style').val(style.replace(Regex.Transform,'').trim().replace(/\r?\n/g, '').replace(/\s?;\s?/g, ';\n'));
    },
    changeTransform: function(){
        let pos = {};
        $('.face-info .input-realtime').each(function(i, e){
            pos[$(e).attr('id').replace('input-','')] = $(e).val();
        })
        Face.transformFace(Face.selectedFace, pos)
        History.stack(Face.selectedFace);
    },
    changeInfo: function($e){
        let attrName = $e.attr('id').replace('input-', '');
        let eleId = Face.selectedFace.attr('id');
        let data = Util.findObjById(Data._tree, eleId);
        if(!data) return; // data가 없으면 삭제된 face

        if(attrName === 'id'){
            Face.selectedFace.attr(attrName, $e.val());
            let changedId = $e.val();
            if(changedId != eleId){
                data['id'] = changedId;
                $('#_list_' + eleId + ' > p i').text(changedId);
                $('#_list_' + eleId).attr('face-id', changedId);
                $('#_list_' + eleId).attr('id', '_list_' + changedId);
                Data._history[changedId] = Data._history[eleId];
                delete Data._history[eleId];
            }
        }
        else if(attrName === 'title'){
            Face.selectedFace.attr(attrName, $e.val());
            let treeItem = $('#_list_' + Face.selectedFace.attr('id') + ' > p .face-name');
            treeItem.attr('title', $e.val())
            treeItem.text($e.val());
        }
        else{
            Face.selectedFace.attr(attrName, $e.val());
        }
    },
    changeStyle: function(historyStack){
        let style = Face.selectedFace.attr('style');
        if(Regex.Transform.test(style)){
            Face.selectedFace.attr('style', style.match(Regex.Transform)[0] + $('#input-style').val().trim());
        }else{
            Face.selectedFace.attr('style', $('#input-style').val().trim());
        }

        if(historyStack){
            History.stack(Face.selectedFace);
        }

    }
}

$(document).ready(function(){

    Data.refresh();


        /********************* init setting **********************/
        // Load the last selected face
        if(Storage.get('selectedFaceId') !== null && $('#_list_'+Storage.get('selectedFaceId')).length > 0){
            Tree.clickTrigger(Storage.get('selectedFaceId'), [true]);
        }else{
            Tree.clickTrigger(Face.observView.attr('id'), [true]);
        }

        // Load layout size
        $('.detail-panel').css('width', Storage.get('detailPanelWidth'));
        $('.detail-panel .face-list').css('height', Storage.get('faceListHeight'));


        // Load textarea height
        $('#input-style').css('height', Storage.get('textareaStyleHeight'));

        // if(!Config.isOnlyViewMode){
        //     // Load before cached "face-scale-viewport"
        //     if(Storage.get('cachedHtmlData') !== null){
        //         openConfirm('확인', '캐쉬된 데이터를 가져오시겠습니까?', {
        //             confirm: function(){
        //                 doLoadData(null, Storage.get('cachedHtmlData'));
        //             },
        //             cancel: function(){
        //             }
        //         }, '가져오기')
        //     }
        // }


    /*********************************************************/

    //Show main panel after loading all contents
    $('.main').removeClass('hidden');



})




















//!!!!!!!!!
