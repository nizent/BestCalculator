function activateInput(inputId){
    document.getElementById(inputId).disabled=false;
}

function deactivateInput(inputId){
    let input=document.getElementById(inputId)
    input.disabled=true;   
    input.value='';
}

function triggerCheckBox(checkBoxId, inputId){
    let checkbox = document.getElementById(checkBoxId);
    if(checkbox.checked){
        activateInput(inputId);
    } else {
        deactivateInput(inputId);
    }
}

function activateEvents(checkBoxId, inputId){
    var cb = document.getElementById(checkBoxId);
    cb.onclick= function(){
        triggerCheckBox(checkBoxId, inputId);
    };    
}

function addProportionalDevolutionOrPayment(dom_day, spa_value, dd_day, mm_month){
    if(dd_day>dom_day){
        if([2,4,6,9,11].includes(mm_month)){
            return (30-dd_day+dom_day)/30*spa_value;
        } else {
            return (31-dd_day+dom_day)/31*spa_value;
        }
    } else {
        if([2,4,6,9,11].includes(mm_month)){
            return (dom_day-dd_day)/30*spa_value;
        } else {
            return (dom_day-dd_day)/31*spa_value;
        }
    }
}

function extractFloat(stringText){
    if(stringText===''){
        return 0;
    } else {
        return parseFloat(stringText);
    }
}

function additionalProportionals(now_int, valor_SVA, dom, mm_month){
    if([2,4,6,9,11].includes(mm_month)){
        if(now_int > dom){
            return valor_SVA*(dom+30-now_int)/30;
        } else {
            return valor_SVA*(dom-now_int)/30;
        }
    } else {
        if(now_int > dom){
            return valor_SVA*(dom+31-now_int)/31;
        } else {
            return valor_SVA*(dom-now_int)/31;
        }
    }
       
}

function calculateProportionals(){
    
    let dom = parseFloat(document.getElementById("DOM").value);
    let spa = parseFloat(document.getElementById("SPA").value);
    let spn = parseFloat(document.getElementById("SPN").value);
    let dcto = document.getElementById("dcto:").value;
    let SVAa = document.getElementById("SVAa:").value;
    let SVAn = document.getElementById("SVAn:").value;
    let CI = document.getElementById("CI:").value;
    let message = "<div id=\"popupCloseButton\" class=\"popupCloseButton\" onclick=\"deactivateMessage();\">&times;</div>";
    message+="<div class=\"scrollable\"><h1 class=\"Title\"> Resultados </h1><br>";
    message += "<table class=\"table table-striped\"><tr><th>Descripci??n</th><th>Valor</th></tr>";
    let today = new Date();
    let dd = parseFloat(String(today.getDate()).padStart(2, '0'));
    let mm = parseFloat(String(today.getMonth() + 1).padStart(2, '0'));

    /*This code adds the proportional devolution*/
    message+="<tr><td>Monto devoluci??n proporcionales</td><td>"+Number(Number(addProportionalDevolutionOrPayment(dom, spa, dd, mm)).toFixed(0)).toLocaleString()+"</td></tr>";
    message+="<tr><td>Monto cobro proporcionales</td><td>"+Number(Number(addProportionalDevolutionOrPayment(dom, spn, dd, mm)).toFixed(0)).toLocaleString()+"</td></tr>";

    CI=extractFloat(CI);
    SVAa=extractFloat(SVAa);
    if(SVAn===''){
        message+="<tr><td>Proporcional servicio adicional</td><td>No aplica</td></tr>";
        if(dom!==dd){
            message+="<tr><td>Monto total a pagar en la siguiente boleta luego del cambio de plan</td><td>"+Number(Number(spn - addProportionalDevolutionOrPayment(dom, spa, dd, mm) + addProportionalDevolutionOrPayment(dom, spn, dd, mm) + SVAa - dcto + CI).toFixed(0)).toLocaleString()+"</td></tr>";
        } else {
            message+="<tr><td>Como ya se le emiti?? su boleta con el plan anterior el monto a pagar en su siguiente boleta es</td><td>"+Number(Number(spa + SVAa).toFixed(0)).toLocaleString()+"</td></tr>";
        }
    } else {
        SVAn=extractFloat(SVAn);
        message+="<tr><td>Proporcional servicio adicional</td><td>"+Number(Number(additionalProportionals(dd, SVAn, dom, mm)).toFixed(0)).toLocaleString()+"</td></tr>";
        if(dom!==dd){
            message+="<tr><td>Monto total a pagar en la siguiente boleta luego del cambio de plan</td><td>"+ Number(Number(spn - addProportionalDevolutionOrPayment(dom, spa, dd, mm) + addProportionalDevolutionOrPayment(dom, spn, dd, mm) + additionalProportionals(dd, SVAn, dom, mm) + SVAa-dcto + CI).toFixed(0)).toLocaleString()+"</td></tr>";
        } else {
            message+="<tr><td>Como ya se le emiti?? su boleta con el plan anterior el monto a pagar en su siguiente boleta es</td><td>"+Number(Number(spa + SVAa).toFixed(0)).toLocaleString()+"</td></tr>";
        }
    }
    message+="</table></div>";
    if(document.getElementById("DOM").value!=='' && document.getElementById("SPA").value && document.getElementById("SPN").value){
        document.getElementById("message").innerHTML=message;    
        document.getElementById("message").style.display="grid";
        document.getElementById("hover_bkgr_fricc").style.display="block";
    }
    
}

activateEvents("dcto_cb:","dcto:");
activateEvents("SVAa_cb:","SVAa:");
activateEvents("SVAn_cb:","SVAn:");
activateEvents("CI_cb:","CI:");

var calculator = document.getElementById("Calculadora");
calculator.onsubmit = function () {
    return false;
};

var submit_button = document.getElementById("submit_button");
submit_button.onclick = function(){
    calculateProportionals();
};

function deactivateMessage(){
    document.getElementById("hover_bkgr_fricc").style.display="none";
}