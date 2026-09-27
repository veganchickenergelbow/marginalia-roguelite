shell = open('shell.html').read()
c = '<style>' + open('extra.css').read() + '</style>'
q = open('questions.js').read()
a = open('app.js').read()
out = shell + c + '\n<script>\n' + q + '\n</script>\n' + a
open('marginalia.html', 'w').write(out)
