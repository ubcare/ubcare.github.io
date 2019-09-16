const Config = {
    isOnlyViewMode: false
}
const Util = {
    makeNewId: function(prefix) {
        var looking = true;
        var i = 1;
		var separator = '';
        if (!prefix) prefix = 'new';
        while (true) {
            if (!this.existId(prefix + separator + i)) break;
            i++;
        }
        return prefix + separator + i;
    },

    existId: function(id) {
        return $('#' + id).length > 0;
    },

    findObjById: function(obj, id) {
        var findObj, founded = false;
        var fn = function(parentArr) {
            parentArr.forEach(function(e, i) {
                if (founded) return;
                if (e.id === id) {
                    findObj = e;
                    founded = true;
                } else {
                    fn(e.children);
                }
            })
        }
        if (obj.children) {
            fn(obj.children);
        }

        return findObj;
    },

    makeInteger: function(obj) {
        for (let key in obj) {
            // obj[key] = Math.round((obj[key] || 0) * 10) / 10;
            obj[key] = parseFloat(parseFloat(obj[key] || 0).toFixed(1));
        }
    },

    _testConsole: function(obj) {
        for (let k in obj) {
            Tree._testConsole(obj[k]);
        }
    },
    testDegree: function(h, w){
        return parseFloat(parseFloat(90 - Math.acos(w/2/h) * (180/Math.PI)).toFixed(1));
    },
    toDataUrl: function(url, callback){
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
            var reader = new FileReader();
            reader.onloadend = function() {
                console.log(reader.result);
                // callback(reader.result);
            }
            reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    }
}

function slideShow(){
    $('#_list_fo > p').trigger('mousedown', [true, true]);
    // Tree.clickTrigger($('.slide').first().attr('id'), [true, true]);
    if($('.slide').length > 0){
        Face.frontViewFace(null, true);
    }else{
        alert('설정된 슬라이드가 없습니다');
    }
}

function saveData() {
    $('.face-highlight').removeClass('face-highlight');
    download('data', $('.contents-panel').html().trim());
}

function download(filename, text) {
    if (!filename) filename = 'html_data'
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}


function exportData() {
    $('.face-highlight').removeClass('face-highlight');

    var $cloned = $('.face-scale-viewport').clone();
    $cloned.find('#style-sass').remove();
    $.ajax({
        url: "css/face.css",
        dataType: "text",
        success: function(txt) {
            let svStyle = Face.scaleView.attr('style') || '';
            let scale = parseFloat(Regex.Scale.test(svStyle) ? svStyle.match(Regex.Scale)[0].replace(/scale\(/gi,'') : 1);
            let data = '<style>' + txt + '</style>' + $cloned.html().trim()
            data = '<span class="h3d" style="transform: scale('+scale+');">\r\n' + data.replace(/\r?\n/g, '') + '\r\n</span>';
            download('export', data);
        }
    });
}


function newPage() {
    openConfirm('확인', '현재 내용이 초기화됩니다.<br>계속 하시겠습니까?', {
        confirm: function(){
            $('.body-panel .contents-panel').html('<div class="face-scale-viewport"><div class="face-observer" id="fo" title="Main" ></div></div>');
            Data.refresh();
            Tree.clickTrigger('fo', [true, true]);
        }
    }, '확인');
}


function forOnlyView(showPanels){
    if(!showPanels){
        $('.header-panel').hide();
        $('.detail-panel').hide();
    }
    let $cover = $('<div class="body-cover">Click to view</div>');
    $cover.on('click', function(e){
        $(this).remove();
    })
    $('.body-panel').append($cover);
}


function imageConverter(){
    $('#image-file').trigger('click');
}
function changeImageFile(e){

    var file = e.files[0];
    if(file.type && file.type.startsWith('image')){
        var reader = new FileReader();
        reader.onloadend = function() {
            openPopup('popImageData', initPopImageData, confirmPopImageData, reader.result);
        }
        reader.readAsDataURL(file);
    }
}
