function render(templateID, context, target) {
  //var source = $("#" + templateID).html();
  //var temp = Handlebars.compile(source);
  var temp = Handlebars.templates[templateID];
  var html = temp(context);
  $(target).html(html);
}

export default render;
