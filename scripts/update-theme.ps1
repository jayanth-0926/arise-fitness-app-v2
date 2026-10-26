$files = @(
  'e:\arise-fitness-app\arise\components\dashboard\ManualPlanBuilder.tsx',
  'e:\arise-fitness-app\arise\components\ProfileForm.tsx',
  'e:\arise-fitness-app\arise\app\(auth)\signup\page.tsx',
  'e:\arise-fitness-app\arise\app\(auth)\login\LoginForm.tsx'
)

foreach ($f in $files) {
  if (Test-Path $f) {
    $c = Get-Content $f -Raw
    # Fix: bg-accent-cyan ... text-white -> text-bg-primary
    $c = $c -replace '(bg-accent-cyan[^"]*?)text-white', '$1text-bg-primary'
    Set-Content $f $c -NoNewline
    Write-Host "Fixed text-white in: $f"
  }
}
Write-Host "Done."
