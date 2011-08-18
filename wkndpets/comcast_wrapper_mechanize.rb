require 'mechanize'

agent = Mechanize.new{}
agent.keep_alive_time=100000
agent.open_timeout=200000
begin

  page = agent.get('https://www.comcast.com/Localization/Localize.ashx?&Referer=/shop/buyflow/default.ashx?SourcePage=Voip');
  form = page.form('aspnetForm')
  form.field_with(:id =>'ctl00__bCPH_localize__streetNameTxt').value = '313 Laurel Hills Dr'
  form.field_with(:id =>'ctl00__bCPH_localize__zipCodeTxt').value = '07016'
#page = form.field_with(:id => 'ctl00__bCPH_localize__submitIbtn_button')
  #page = agent.submit(form, form.buttons.first)

rescue => e
  puts e.message
  puts e.class
end
#puts "After rescue"


#form(ctl00__bCPH_localize__streetNameTxt) = '313 Laurel Hills Dr'
#form.id.ctl00__bCPH_localize__zipCodeTxt = '07016'
#pp form

#page = agent.get('http://google.com')
#google_form = page.form('f')
#google_form.q = 'Rupes bhochhibhoya'
#pp google_form
#page = agent.submit(google_form,google_form.buttons.first)
#myfile = File.new('c:\tmp\comcast.html', 'w');
#myfile.write(page.body);


