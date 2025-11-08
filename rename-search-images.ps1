# Script to rename image files in search folder
$searchPath = "c:\PPY\IUH_HK2_3\Mobile\video_sharing\assets\images\profile"

Get-ChildItem -Path $searchPath -Filter "*.png" | Where-Object { $_.Name -match ' ' } | ForEach-Object {
    $newName = $_.Name.ToLower() -replace ' ', '-'
    $oldPath = $_.FullName
    $newPath = Join-Path -Path $searchPath -ChildPath $newName
    
    Rename-Item -Path $oldPath -NewName $newName -Force
    Write-Host "Renamed: $($_.Name) -> $newName"
}

Write-Host "`nAll files renamed successfully!"
