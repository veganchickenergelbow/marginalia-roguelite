$shell = Get-Content shell.html -Raw -Encoding UTF8
$css = '<style>' + (Get-Content extra.css -Raw -Encoding UTF8) + '</style>'
$q = Get-Content questions.js -Raw -Encoding UTF8
$a = Get-Content app.js -Raw -Encoding UTF8
$out = $shell + $css + "`n<script>`n" + $q + "`n</script>`n" + $a
$utf8NoBom = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllText("$PSScriptRoot\marginalia.html", $out, $utf8NoBom)
Copy-Item "$PSScriptRoot\marginalia.html" "$PSScriptRoot\index.html" -Force
Write-Host "Built marginalia.html and index.html"
