$(document).ready(function(){
      var options={
        format: 'dd/mm/yyyy',
        todayHighlight: true,
        autoclose: true
      };
      $('#street_date_to,#street_date_from').datepicker(options);
})