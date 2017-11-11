$(document).ready(function(){
      var container=$('.bootstrap-iso form').length>0 ? $('.bootstrap-iso form').parent() : "body";
      var options={
        format: 'mm/dd/yyyy',
        container: container,
        todayHighlight: true,
        autoclose: true,
      };
      $('input[name="date"]').datepicker(options);
      $('input[name="date2"]').datepicker(options);
})