var serviceApp = angular.module('whatsapp', []);

serviceApp.service('whatsModel', function($rootScope) {

    var listaContatos;
    var historicoLigacoes;
    var historicoConversas;

    this.getListaContatos = function() {
        return listaContatos;
    };

    this.setListaContatos = function(data) {
        listaContatos = data;
    };

    this.getHistoricoLigacoes = function() {
        return historicoLigacoes;
    };

    this.setHistoricoLigacoes = function(data) {
        historicoLigacoes = data;
    };

    this.getHistoricoConversas = function() {
        return historicoConversas;
    };

    this.setHistoricoConversas = function(data) {
        historicoConversas = data;
    };

    this.addNovaConversa = function(destinatarioId, dataHora, mensagem, enviou , lida , contador ) {
        historicoConversas.push({
            destinatarioId: destinatarioId,
            dataHora: dataHora,
            mensagem: mensagem,
            enviou: enviou,
            lida: lida,
            contador: contador,
        });
    };

    this.removeConversa = function(i) {
        historicoConversas.splice(i, 1);
    };  

    this.addNovoContato = function(id, nome, status, tipo, fotoLink ) {
        listaContatos.push({
            id: id,
            nome: nome,
            status: status,
            tipo: tipo,
            fotoLink: fotoLink
        });
    };

    this.removeContato = function(i) {
        listaContatos.splice(i, 1);
    }; 

    this.addNovoHistoricoLigacao = function(destinatarioId, dataHora, ligou ) {
        historicoLigacoes.push({
            destinatarioId: destinatarioId,
            dataHora: dataHora,
            ligou: ligou
        });
    };

    this.removeHistoricoLigacao = function(i) {
        historicoLigacoes.splice(i, 1);
    }; 

    this.getContato = function(i){

        var contato = [];
        
        angular.forEach(listaContatos, function(value, key) {  
            if( i == value.id ){
                this.push(value);                
            }
        }, contato); 
        
        return contato;
    }

});

serviceApp.run ( function($rootScope, $http, whatsModel) {

    $http.get('json/contatos.json').
    success(function(data) {
        whatsModel.setListaContatos(data);
        $rootScope.listaContatos = whatsModel.getListaContatos();
    }).
    error(function() {
        whatsModel.setListaContatos([]);
        Materialize.toast('Não foi possível carregar a lista de contatos!', 4000);
    });

    $http.get('json/conversas.json').
    success(function(data) {
        whatsModel.setHistoricoConversas(data);
        $rootScope.historicoConversas = whatsModel.getHistoricoConversas();
    }).
    error(function() {
        whatsModel.setHistoricoConversas([]);
        Materialize.toast('Não foi possível carregar a lista de conversa!', 4000);
    });

    $http.get('json/chamadas.json').
    success(function(data) {
        whatsModel.setHistoricoLigacoes(data);
        $rootScope.historicoLigacoes = whatsModel.getHistoricoLigacoes();
    }).
    error(function() {
        whatsModel.setHistoricoLigacoes([]);
        Materialize.toast('Não foi possível carregar a lista de ligações!', 4000);
    });

    $rootScope.pagina = "conversas";
    $rootScope.iconOpcao = "mdi-communication-chat";
    $rootScope.linkIcon = "#";     
    
});

serviceApp.controller('whatsController', function( $scope, $rootScope, whatsModel ) {

    $scope.pesquisa = "";
    
    $scope.mudarPagina = function(pagina) {
        switch(pagina){
            case "conversas":
                $rootScope.pagina = "conversas";
                $rootScope.iconOpcao = "mdi-communication-chat";
                $rootScope.linkIcon = "#";
                break;
            case "chamadas":
                $rootScope.pagina = "chamadas";
                $rootScope.iconOpcao = "mdi-communication-call";
                $rootScope.linkIcon = "#";
                break;
            case "contatos":
                $rootScope.pagina = "contatos";
                $rootScope.iconOpcao = "mdi-social-person-add";
                $rootScope.linkIcon = "#";
                break;
        }
    };
    
    $scope.buscarContato = function(i){      
        return whatsModel.getContato(i);  
    };


});

serviceApp.filter('unique', function() {
    return function(collection, keyname) {
        var output = [], 
            keys = [];

        angular.forEach(collection, function(item) {
            var key = item[keyname];
            if(keys.indexOf(key) === -1) {
                keys.push(key);
                output.push(item);
            }
        });

        return output;
    };
});