# Rename files in assets/images create-* folders: replace spaces with '-' and convert to lowercase
$root = "C:\PPY\IUH_HK2_3\Mobile\video_sharing\assets\images"

Get-ChildItem -Path $root -Directory | Where-Object { $_.Name -like "create*" } | ForEach-Object {
    $dir = $_.FullName
    Write-Host "Processing folder: $($_.Name)"
    Get-ChildItem -Path $dir -File | ForEach-Object {
        $old = $_.Name
        $new = $old -replace ' ', '-'
        $new = $new.ToLower()
        # collapse multiple hyphens
        while ($new -match '--') { $new = $new -replace '--', '-' }
        # trim leading/trailing hyphens and dots
        $new = $new.Trim('-')
        $oldPath = $_.FullName
        $newPath = Join-Path $dir $new
        if ($oldPath -ne $newPath) {
            if (-not (Test-Path $newPath)) {
                try {
                    Rename-Item -Path $oldPath -NewName $new -ErrorAction Stop
                    Write-Host "Renamed: $old -> $new"
                }
                catch {
                    Write-Host "Failed to rename $old : $_"
                }
            }
            else {
                Write-Host "Skipping (exists): $new in $($_.Directory.Name)"
            }
        }
    }
}
Write-Host "All create-* folders processed."
