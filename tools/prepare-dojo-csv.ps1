param(
    [Parameter(Mandatory = $true)]
    [string]$InputPath,

    [ValidateSet('科目A', '科目B')]
    [string]$Subject = '科目A',

    [string]$OutputPath
)

$resolvedInput = (Resolve-Path -LiteralPath $InputPath).Path
if (-not $OutputPath) {
    $directory = Split-Path -Parent $resolvedInput
    $baseName = [System.IO.Path]::GetFileNameWithoutExtension($resolvedInput)
    $OutputPath = Join-Path $directory ($baseName + '_notion_utf8.csv')
}

$sourceEncoding = [System.Text.Encoding]::GetEncoding(932)
$raw = [System.IO.File]::ReadAllText($resolvedInput, $sourceEncoding)
$rows = @($raw | ConvertFrom-Csv)

if ($rows.Count -eq 0) {
    throw 'CSVにデータ行がありません。'
}

$requiredHeaders = @('No.', '正誤', '分野名', '大分類', '中分類', '出典', '学習日')
$actualHeaders = @($rows[0].PSObject.Properties.Name)
$missing = @($requiredHeaders | Where-Object { $_ -notin $actualHeaders })
if ($missing.Count -gt 0) {
    throw ('必要な列がありません: ' + ($missing -join ', '))
}

$importStamp = [System.IO.Path]::GetFileNameWithoutExtension($resolvedInput)
$prepared = foreach ($row in $rows) {
    $date = [datetime]::ParseExact($row.学習日, 'yyyy/M/d', $null)
    $system = if ($Subject -eq '科目B') { '科目B' } else {
        switch ($row.分野名) {
            'テクノロジ系' { 'テクノロジ' }
            'マネジメント系' { 'マネジメント' }
            'ストラテジ系' { 'ストラテジ' }
            default { $row.分野名 }
        }
    }
    $importId = '{0}|{1}' -f $importStamp, $row.'No.'

    [pscustomobject]@{
        '記録名' = '{0}｜{1}｜{2}｜{3}' -f $Subject, $date.ToString('yyyy-MM-dd'), $row.中分類, $row.'No.'
        '正誤' = $row.正誤
        '科目' = $Subject
        '系統' = $system
        '大分類' = $row.大分類
        '中分類' = $row.中分類
        '出典' = $row.出典
        '学習日' = $date.ToString('yyyy-MM-dd')
        '正解点' = if ($row.正誤 -eq '○') { 1 } else { 0 }
        '取込ID' = $importId
    }
}

$prepared | Export-Csv -LiteralPath $OutputPath -NoTypeInformation -Encoding utf8BOM

$correct = @($prepared | Where-Object { $_.正誤 -eq '○' }).Count
[pscustomobject]@{
    OutputPath = (Resolve-Path -LiteralPath $OutputPath).Path
    Rows = $prepared.Count
    Correct = $correct
    Incorrect = $prepared.Count - $correct
    Accuracy = [math]::Round(($correct / $prepared.Count) * 100, 1)
}
