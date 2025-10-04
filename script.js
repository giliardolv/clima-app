const input = document.getElementById('input-area')
const listaSugestoes = document.getElementById('sugestoes')
const buscarBtn = document.getElementById('botao-buscar')
const infoContainer = document.getElementById('clima-info')
const infoCidade = document.getElementById('cidade-nome')
const infoTemperatura = document.getElementById('temperatura')
const infoVento = document.getElementById('vento')
let delayBusca
let cidadeSelecionada = null

function montarLista(cidades) {
    listaSugestoes.innerHTML = ''

    cidades.forEach((cidade) => {
        const itemLista = document.createElement('li')
        const dadosDaCidade = `${cidade.name}, ${cidade.admin1}, ${cidade.country}`
        itemLista.innerText = dadosDaCidade

        listaSugestoes.appendChild(itemLista)

        itemLista.addEventListener('click', () => {
            input.value = dadosDaCidade
            listaSugestoes.innerHTML = ''
            cidadeSelecionada = cidade
        })
    })
}

async function buscarCoordenadas(cidade) {
    try{
        const resposta = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cidade}&count=5`)
        const dados = await resposta.json()

        if(!dados.results || dados.results.length === 0){
            listaSugestoes.innerHTML = '<li>Nenhuma cidade encontrada</li>'
            return
        }

        montarLista(dados.results)
    }
    catch(erro){
        console.error('Erro na busca:', erro)
    }
}

async function buscarClima(cidade) {
    try {
        const resposta = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${cidade.latitude}&longitude=${cidade.longitude}&current_weather=true`)
        const dados = await resposta.json()

        console.log(dados)
        
        const dadosCidade = `${cidade.name}, ${cidade.admin1}, ${cidade.country}`
        const temperatura = dados.current_weather.temperature
        const velocidadeVento = dados.current_weather.windspeed
        const direcaoVento = dados.current_weather.winddirection
        

        infoCidade.innerText = dadosCidade
        infoTemperatura.innerText = `${temperatura}Cº`
        infoVento.innerText = `Vento: ${velocidadeVento} Km/h ${direcaoVento}º`
    }
    catch (erro) {
        console.error('Erro na busca do clima:', erro)
    }
}

buscarBtn.addEventListener('click', (evento) => {
    evento.preventDefault()
    buscarClima(cidadeSelecionada)
})

input.addEventListener("input", (evento) => {
    const textoInput = evento.target.value;
    if(textoInput.length < 2){
        listaSugestoes.innerHTML = ''
        return
    }

    clearTimeout(delayBusca)
    
    delayBusca = setTimeout(() => {
        if(textoInput.length > 1){
            console.log('Buscando...')
            buscarCoordenadas(textoInput)
        }
    }, 500)
})
