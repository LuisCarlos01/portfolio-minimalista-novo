# Script para atualizar imports após renomear arquivos .js para .jsx

# Função para atualizar imports em um arquivo específico
function Update-Imports-In-File {
    param ($filePath)
    
    Write-Host "Verificando imports em $filePath"
    
    # Ler o conteúdo do arquivo
    $content = Get-Content -Path $filePath -Raw
    
    # Lista de bibliotecas externas que não devem ser convertidas para .jsx
    $externalLibraries = @(
        "react",
        "react-dom",
        "gsap",
        "typed.js",
        "react-router-dom",
        "react-icons"
    )
    
    # Regex que exclui as bibliotecas externas da substituição
    $externalLibPattern = $externalLibraries -join "|"
    
    # Substituir imports com extensão .js para .jsx, excluindo bibliotecas externas
    $newContent = $content -replace "import\s+(.+?)\s+from\s+['\"](?!($externalLibPattern))(.+?)\.js['\"]", "import `$1 from '`$3.jsx'"
    
    # Se o conteúdo foi modificado, salvar as alterações
    if ($content -ne $newContent) {
        Write-Host "  Atualizando imports em $filePath"
        Set-Content -Path $filePath -Value $newContent
    }
}

# Diretórios a serem verificados
$directories = @(
    ".\src",
    ".\src\components",
    ".\src\hooks",
    ".\src\contexts"
)

# Processar cada diretório
foreach ($dir in $directories) {
    if (Test-Path $dir) {
        # Obter todos os arquivos .jsx no diretório
        $files = Get-ChildItem -Path $dir -Filter "*.jsx" -File
        
        foreach ($file in $files) {
            Update-Imports-In-File -filePath $file.FullName
        }
    } else {
        Write-Host "Diretório não encontrado: $dir"
    }
}

Write-Host "Processo de atualização de imports concluído!" 