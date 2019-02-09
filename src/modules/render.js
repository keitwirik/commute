function render(templateID, context, target) {
  var temp = Handlebars.templates[templateID];
  var html = temp(context);
  $(target).html(html);
}

export default render;
