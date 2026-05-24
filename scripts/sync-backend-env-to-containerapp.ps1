param(
    [string]$ResourceGroup = "Tick-It",
    [string]$ContainerAppName = "tickit-backend",
    [string]$EnvFilePath = "backend/.env",
    [string]$Subscription = "",
    [switch]$IncludeAllEnvFileKeys,
    [switch]$SkipLogin
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Test-AzCli {
    $az = Get-Command az -ErrorAction SilentlyContinue
    if (-not $az) {
        throw "Azure CLI (az) is not available in this terminal."
    }
}

function Parse-DotEnvFile {
    param([string]$Path)

    if (-not (Test-Path -LiteralPath $Path)) {
        throw "Env file not found: $Path"
    }

    $map = [ordered]@{}
    $lines = Get-Content -LiteralPath $Path

    foreach ($rawLine in $lines) {
        $line = $rawLine.Trim()
        if ($line.Length -eq 0 -or $line.StartsWith("#")) {
            continue
        }

        if ($line -notmatch "^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$") {
            continue
        }

        $key = $Matches[1]
        $value = $Matches[2].Trim()

        if (
            ($value.StartsWith('"') -and $value.EndsWith('"') -and $value.Length -ge 2) -or
            ($value.StartsWith("'") -and $value.EndsWith("'") -and $value.Length -ge 2)
        ) {
            $value = $value.Substring(1, $value.Length - 2)
        }

        $map[$key] = $value
    }

    return $map
}

function Get-BackendUsedEnvKeys {
    $paths = @("backend/config", "backend/app", "backend/bootstrap")
    $keys = New-Object "System.Collections.Generic.HashSet[string]"

    $rg = Get-Command rg -ErrorAction SilentlyContinue
    if ($rg) {
        $output = rg -o --no-filename "env\('([A-Z0-9_]+)'" @paths 2>$null
        foreach ($line in $output) {
            if ($line -match "env\('([A-Z0-9_]+)'") {
                [void]$keys.Add($Matches[1])
            }
        }
    } else {
        $files = Get-ChildItem -Path $paths -File -Recurse
        foreach ($file in $files) {
            $matches = Select-String -Path $file.FullName -Pattern "env\('([A-Z0-9_]+)'" -AllMatches
            foreach ($m in $matches) {
                foreach ($g in $m.Matches) {
                    [void]$keys.Add($g.Groups[1].Value)
                }
            }
        }
    }

    # Direct env() usage outside config
    [void]$keys.Add("CLOUDINARY_URL")
    [void]$keys.Add("PRODUCT_API_URL")

    return $keys
}

function Convert-ToSecretName {
    param([string]$Key)
    return ($Key.ToLower() -replace "_", "-")
}

function Is-SensitiveKey {
    param([string]$Key)
    return $Key -match "(PASSWORD|SECRET|TOKEN|APP_KEY|CLOUDINARY_URL|AWS_ACCESS_KEY_ID|AWS_SECRET_ACCESS_KEY|MAIL_PASSWORD|DB_PASSWORD|REDIS_PASSWORD|POSTMARK_TOKEN|RESEND_KEY|SLACK_BOT_USER_OAUTH_TOKEN)"
}

Test-AzCli

if (-not $SkipLogin) {
    az login --output none | Out-Null
}

if ($Subscription.Trim().Length -gt 0) {
    az account set --subscription $Subscription
}

$account = az account show --query "{name:name, id:id}" -o json | ConvertFrom-Json
Write-Host "Using Azure subscription: $($account.name) ($($account.id))"

$envMap = Parse-DotEnvFile -Path $EnvFilePath
$usedKeys = Get-BackendUsedEnvKeys

if ($IncludeAllEnvFileKeys) {
    $targetKeys = @($envMap.Keys)
} else {
    $targetKeys = @($usedKeys | Where-Object { $envMap.Contains($_) })
}

if ($targetKeys.Count -eq 0) {
    throw "No matching env vars found to sync. Check $EnvFilePath and backend env() usage."
}

$secretPairs = @()
$envPairs = @()
$skippedEmpty = @()

foreach ($key in $targetKeys) {
    $value = [string]$envMap[$key]
    if ($value.Trim().Length -eq 0) {
        $skippedEmpty += $key
        continue
    }

    if (Is-SensitiveKey -Key $key) {
        $secretName = Convert-ToSecretName -Key $key
        $secretPairs += "$secretName=$value"
        $envPairs += "$key=secretref:$secretName"
    } else {
        $envPairs += "$key=$value"
    }
}

if ($secretPairs.Count -gt 0) {
    Write-Host "Setting $($secretPairs.Count) secrets on container app '$ContainerAppName'..."
    az containerapp secret set `
        --resource-group $ResourceGroup `
        --name $ContainerAppName `
        --secrets @secretPairs `
        --output none
}

if ($envPairs.Count -gt 0) {
    Write-Host "Setting $($envPairs.Count) environment variables on container app '$ContainerAppName'..."
    az containerapp update `
        --resource-group $ResourceGroup `
        --name $ContainerAppName `
        --set-env-vars @envPairs `
        --output none
}

if ($skippedEmpty.Count -gt 0) {
    Write-Warning ("Skipped empty values for keys: " + ($skippedEmpty -join ", "))
}

Write-Host "Done. Synced backend env vars to Container App '$ContainerAppName' in resource group '$ResourceGroup'."
