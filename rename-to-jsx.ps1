# Script para renomear arquivos .js de componentes React para .jsx

# Diretório dos componentes
$componentsDir = ".\src\components"
$hooksDir = ".\src\hooks"
$contextsDir = ".\src\contexts"

# Lista de arquivos que não devem ser renomeados (utilidades, configurações, etc.)
$excludeFiles = @(
    "setupTests.js",
    "reportWebVitals.js",
    "serviceWorker.js",
    "index.js",
    "test-utils.js"
)

# Função para verificar se um arquivo é um componente React
function Is-ReactComponent {
    param($filePath)
    
    # Verificar se o arquivo está na lista de exclusão
    $fileName = Split-Path -Leaf $filePath
    if ($excludeFiles -contains $fileName) {
        return $false
    }
    
    $content = Get-Content $filePath -Raw
    
    # Verificar se é um componente React
    $isReactComponent = ($content -match "import React" -or 
                        $content -match "from ['\""]react['\"]" -or
                        $content -match "<[A-Z][A-Za-z]+" -or  # JSX tag
                        $content -match "className=" -or       # JSX attribute
                        $content -match "function [A-Z][A-Za-z]+\(" -or # Function component
                        $content -match "const [A-Z][A-Za-z]+ = \(" -or # Arrow function component
                        $content -match "export default" -and 
                        ($content -match "function" -or $content -match "const") -and
                        $content -match "return \("))
    
    return $isReactComponent
}

# Função para renomear arquivos em um diretório
function Rename-JsToJsx {
    param($directory)
    
    Write-Host "Verificando arquivos em $directory..."
    
    # Obter todos os arquivos .js no diretório
    $jsFiles = Get-ChildItem -Path $directory -Filter "*.js" -File
    
    foreach ($file in $jsFiles) {
        # Verificar se o arquivo é um componente React
        if (Is-ReactComponent -filePath $file.FullName) {
            $newName = $file.FullName -replace "\.js$", ".jsx"
            Write-Host "Renomeando $($file.Name) para $($file.Name -replace '\.js$', '.jsx')"
            Rename-Item -Path $file.FullName -NewName $newName
        } else {
            Write-Host "Ignorando $($file.Name) - não é um componente React"
        }
    }
}

# Verificar se os diretórios existem e renomear arquivos
if (Test-Path $componentsDir) {
    Rename-JsToJsx -directory $componentsDir
} else {
    Write-Host "Diretório de componentes não encontrado: $componentsDir"
}

if (Test-Path $hooksDir) {
    Rename-JsToJsx -directory $hooksDir
} else {
    Write-Host "Diretório de hooks não encontrado: $hooksDir"
}

if (Test-Path $contextsDir) {
    Rename-JsToJsx -directory $contextsDir
} else {
    Write-Host "Diretório de contexts não encontrado: $contextsDir"
}

Write-Host "Processo de renomeação concluído!" 