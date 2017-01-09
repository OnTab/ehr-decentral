/* globals FileReader */
'use strict'

// config variables
var ipfsHost = 'localhost',
    ipfsAPIPort = '5001',
    ipfsWebPort = '8080',
    web3Host    =  'localhost', //'http://xepa.local',
    web3Port    = '8545';    

// setup the IPFS connection
var ipfsAPI = require('ipfs-api') 
const ipfs = ipfsAPI(ipfsHost, ipfsAPIPort, {protocol: 'http'}) // leaving out the arguments will default to these values

// check for IPFS connectivity
ipfs.swarm.peers(function(err, response) {
    if (err) {
        console.error(err);
    } else {
        console.log("IPFS - connected to " + response.length + " peers");
        // console.log(response);
    }
});

// web3
// var web3 = new Web3();
var Web3 = require('web3');
// var web3 = new Web3(new Web3.providers.HttpProvider("http://" + web3Host + ":" web3Port));
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

// JavaScript smart contract interface
var abi = [{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"providers","outputs":[{"name":"title","type":"string"},{"name":"canRead","type":"bool"},{"name":"canWrite","type":"bool"},{"name":"password","type":"string"},{"name":"ipfsHash","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"provider","type":"address"}],"name":"getPassword","outputs":[{"name":"password","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"provider","type":"address"},{"name":"title","type":"string"}],"name":"giveWriteOnlyAccessTo","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"provider","type":"address"},{"name":"title","type":"string"}],"name":"giveReadOnlyAccessTo","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"password","type":"string"},{"name":"ipfsHash","type":"string"}],"name":"saveFileLocation","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"provider","type":"address"},{"name":"title","type":"string"}],"name":"revokeAllAccessFrom","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"provider","type":"address"}],"name":"hasReadAccess","outputs":[{"name":"x","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"provider","type":"address"}],"name":"getFileLocation","outputs":[{"name":"ipfsHash","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"provider","type":"address"},{"name":"title","type":"string"}],"name":"giveAllAccessTo","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"patient","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"provider","type":"address"}],"name":"hasWriteAccess","outputs":[{"name":"x","type":"bool"}],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"}];

// smart contract bytecode
var bytecode = '606060405234610000575b60018054600160a060020a03338116600160a060020a031990921691909117808355604080518082018252600781527f70617469656e7400000000000000000000000000000000000000000000000000602080830191825293909416600090815280845291822090518154828452928490209195601f60026000199286161561010002929092019094160483019390930481019390918390106100b857805160ff19168380011785556100e5565b828001600101855582156100e5579182015b828111156100e55782518255916020019190600101906100ca565b5b506101069291505b8082111561010257600081556001016100ee565b5090565b505060018054600160a060020a039081166000908152602081905260408082208401805460ff191685179055835490921681522001805461ff0019166101001790555b5b610e96806101596000396000f300606060405236156100935763ffffffff60e060020a6000350416630787bc27811461009857806308026668146102445780631430f970146102dd5780632a2f78da1461033c57806341e64f441461039b57806357791c2c1461042d5780636756ac111461048c5780639e32c72e146104b9578063ba8fd88114610552578063bd96bd20146105b1578063f7c1ec9f146105da575b610000565b34610000576100b1600160a060020a0360043516610607565b6040805185151560208201528415159181019190915260a080825286546002600019610100600184161502019091160490820181905281906060820190608083019060c08401908a9080156101475780601f1061011c57610100808354040283529160200191610147565b820191906000526020600020905b81548152906001019060200180831161012a57829003601f168201915b50508481038352865460026000196101006001841615020190911604808252602090910190879080156101bb5780601f10610190576101008083540402835291602001916101bb565b820191906000526020600020905b81548152906001019060200180831161019e57829003601f168201915b505084810382528554600260001961010060018416150201909116048082526020909101908690801561022f5780601f106102045761010080835404028352916020019161022f565b820191906000526020600020905b81548152906001019060200180831161021257829003601f168201915b50509850505050505050505060405180910390f35b346100005761025d600160a060020a0360043516610631565b6040805160208082528351818301528351919283929083019185019080838382156102a3575b8051825260208311156102a357601f199092019160209182019101610283565b505050905090810190601f1680156102cf5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b346100005760408051602060046024803582810135601f810185900485028601850190965285855261033a958335600160a060020a0316959394604494939290920191819084018382808284375094965061071395505050505050565b005b346100005760408051602060046024803582810135601f810185900485028601850190965285855261033a958335600160a060020a0316959394604494939290920191819084018382808284375094965061082395505050505050565b005b346100005761033a600480803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284375050604080516020601f89358b0180359182018390048302840183019094528083529799988101979196509182019450925082915084018382808284375094965061092e95505050505050565b005b346100005760408051602060046024803582810135601f810185900485028601850190965285855261033a958335600160a060020a03169593946044949392909201918190840183828082843750949650610ae695505050505050565b005b34610000576104a5600160a060020a0360043516610bec565b604080519115158252519081900360200190f35b346100005761025d600160a060020a0360043516610c26565b6040805160208082528351818301528351919283929083019185019080838382156102a3575b8051825260208311156102a357601f199092019160209182019101610283565b505050905090810190601f1680156102cf5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b346100005760408051602060046024803582810135601f810185900485028601850190965285855261033a958335600160a060020a03169593946044949392909201918190840183828082843750949650610d0795505050505050565b005b34610000576105be610e1c565b60408051600160a060020a039092168252519081900360200190f35b34610000576104a5600160a060020a0360043516610e2b565b604080519115158252519081900360200190f35b6000602081905290815260409020600181015460ff80821691610100900416600283016003840185565b60408051602081810183526000808352600160a060020a033316815290819052919091206001015460ff16151561066757610000565b600160a060020a038216600090815260208181526040918290206002908101805484516001821615610100026000190190911692909204601f8101849004840283018401909452838252909290918301828280156107065780601f106106db57610100808354040283529160200191610706565b820191906000526020600020905b8154815290600101906020018083116106e957829003601f168201915b505050505090505b919050565b60015433600160a060020a0390811691161461072e57610000565b806000600084600160a060020a0316600160a060020a031681526020019081526020016000206000019080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106107a057805160ff19168380011785556107cd565b828001600101855582156107cd579182015b828111156107cd5782518255916020019190600101906107b2565b5b506107ee9291505b808211156107ea57600081556001016107d6565b5090565b5050600160a060020a0382166000908152602081905260409020600101805460ff1961ff0019909116610100171690555b5050565b60015433600160a060020a0390811691161461083e57610000565b806000600084600160a060020a0316600160a060020a031681526020019081526020016000206000019080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106108b057805160ff19168380011785556108dd565b828001600101855582156108dd579182015b828111156108dd5782518255916020019190600101906108c2565b5b506108fe9291505b808211156107ea57600081556001016107d6565b5090565b5050600160a060020a03821660009081526020819052604090206001908101805461ffff191690911790555b5050565b33600160a060020a0316600090815260208190526040902060010154610100900460ff16151561095d57610000565b816000600033600160a060020a0316600160a060020a031681526020019081526020016000206002019080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106109cf57805160ff19168380011785556109fc565b828001600101855582156109fc579182015b828111156109fc5782518255916020019190600101906109e1565b5b50610a1d9291505b808211156107ea57600081556001016107d6565b5090565b5050806000600033600160a060020a0316600160a060020a031681526020019081526020016000206003019080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10610a9157805160ff1916838001178555610abe565b82800160010185558215610abe579182015b82811115610abe578251825591602001919060010190610aa3565b5b50610adf9291505b808211156107ea57600081556001016107d6565b5090565b50505b5050565b60015433600160a060020a03908116911614610b0157610000565b806000600084600160a060020a0316600160a060020a031681526020019081526020016000206000019080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10610b7357805160ff1916838001178555610ba0565b82800160010185558215610ba0579182015b82811115610ba0578251825591602001919060010190610b85565b5b50610bc19291505b808211156107ea57600081556001016107d6565b5090565b5050600160a060020a0382166000908152602081905260409020600101805461ffff191690555b5050565b600160a060020a03811660009081526020819052604081206001015460ff1615610c185750600161070e565b50600061070e565b5b919050565b60408051602081810183526000808352600160a060020a033316815290819052919091206001015460ff161515610c5c57610000565b600160a060020a0382166000908152602081815260409182902060030180548351601f6002600019610100600186161502019093169290920491820184900484028101840190945280845290918301828280156107065780601f106106db57610100808354040283529160200191610706565b820191906000526020600020905b8154815290600101906020018083116106e957829003601f168201915b505050505090505b919050565b60015433600160a060020a03908116911614610d2257610000565b806000600084600160a060020a0316600160a060020a031681526020019081526020016000206000019080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10610d9457805160ff1916838001178555610dc1565b82800160010185558215610dc1579182015b82811115610dc1578251825591602001919060010190610da6565b5b50610de29291505b808211156107ea57600081556001016107d6565b5090565b5050600160a060020a03821660009081526020819052604090206001908101805460ff1961ff0019909116610100171690911790555b5050565b600154600160a060020a031681565b600160a060020a038116600090815260208190526040812060010154610100900460ff1615610c185750600161070e565b50600061070e565b5b9190505600a165627a7a72305820bce3be9665faf508576b53c61f936882f0e6fb057024106a3e867031ba8b499f0029';

//
var notSoSimpleStorageContractObject = web3.eth.contract(abi);

// Globals... who cares...
window.ipfs = ipfs;
window.web3 = web3;
window.notSoSimpleStorageContractObject = notSoSimpleStorageContractObject;
window.ipfsDataHost = "http://" + ipfsHost + ':' + ipfsWebPort + "/ipfs";

// Smart Contract stuff

// Load Smart Contract
function loadContract(contractAddress) {    
    window.currentData = null;
    window.currentPassword = null;
    if (window.contractInstance) {
        console.error('Contract already exists. Identifier: ', window.contractAddress);
        return false;
    }

    window.contractAddress = contractAddress;
    window.contractInstance = window.notSoSimpleStorageContractObject.at(contractAddress);    
    if (window.contractInstance) {
        console.log('Contract loaded successfully at this address: ', window.contractInstance.address);
        alert('Contract loaded successfully at this address: '+ window.contractInstance.address);
        return false;
    }
}

// Deploy Smart Contract
function deployContract() {
    window.currentIPFSHash = null;
    window.currentData = null;
    window.currentPassword = null;
    if (window.contractInstance) {
        console.error('Contract already deployed. Identifier: ', window.contractAddress);
        return false;
    }
    window.notSoSimpleStorageContractObject.new(window.deployContractObject, function(err, contract) {
        if (err) {
            console.error('Error deploying contract: ', err);
        } else if (contract.address) {
            var contractAddress = contract.address;
            window.contractAddress = contractAddress;
            window.contractInstance = window.notSoSimpleStorageContractObject.at(contractAddress);
            console.log('Contract deployed at address ', contractAddress);
            alert('Contract deployed at address ' + contractAddress);
        } else if (contract.transactionHash) {
            console.log("Waiting for contract to be deployed... Contract's transaction hash: ", contract.transactionHash);  
        } else {
            console.error('Unknown error deploying contract');
        }
    });
}

// Send a transaction to save file location and passowrd on the Blockchain
function saveFileLocationWithPassword(password, data) {
    if (!window.contractInstance) {
        console.error('Make sure you deploy your contract first');
        return;
    }
    if (password == null) {
        console.error("Password cannot be empty!");
        return;
    }
    //if (window.currentPassword == password) {
    //    console.error("Why would you override your contract's password with the same password, you dummy?");
    //    return;
    //}
    //if (window.currentData == data) {
    //    console.error("Why would you override your contract's data with the same data, you dummy?");
    //    return;
    //}
    window.contractInstance.saveFileLocation.sendTransaction(password, data, window.sendDataObject, function(err, result){
        if (err) {
            console.error('Error saving file locatoin and password: ', err);
        } else {
            window.currentData = data;
            console.log('Successfully saved password and file data. Transaction hash: ', result);
            alert('Successfully saved password and file data. Transaction hash: ' + result);
        }
    });
}

// Send a transaction to save file location and passowrd on the Blockchain
function giveWriteOnlyAccessTo(providerAddress) {
    if (!window.contractInstance) {
        console.error('Make sure you deploy your contract first');
        return;
    }
    if (providerAddress == null) {
        console.error("Provider's Address cannot be empty!");
        return;
    }
    
    window.contractInstance.giveWriteOnlyAccessTo.sendTransaction(providerAddress, "drWRITE", window.sendDataObject, function(err, result){
        if (err) {
            console.error('Error giveWriteOnlyAccessTo: ', err);
        } else {            
            console.log('Successfully giveWriteOnlyAccessTo. Transaction hash: ', result);
            alert('Successfully giveWriteOnlyAccessTo. Transaction hash: ' + result);
        }
    });
}

// Send a transaction to save file location and passowrd on the Blockchain
function giveReadOnlyAccessTo(providerAddress) {
    if (!window.contractInstance) {
        console.error('Make sure you deploy your contract first');
        return;
    }
    if (providerAddress == null) {
        console.error("Provider's Address cannot be empty!");
        return;
    }
    
    window.contractInstance.giveReadOnlyAccessTo.sendTransaction(providerAddress, "drREAd", window.sendDataObject, function(err, result){
        if (err) {
            console.error('Error giveReadOnlyAccessTo: ', err);
        } else {            
            console.log('Successfully giveReadOnlyAccessTo. Transaction hash: ', result);
            alert('Successfully giveReadOnlyAccessTo. Transaction hash: ' + result);
        }
    });
}

// Get the password data back from Smart Contract
function getPassword(providerAddress) {
    if (!window.contractInstance) {
        console.error('Make sure you deploy your contract first');
        return;
    }
    window.contractInstance.getPassword.call(providerAddress, function(err, result){
        if (err) {
            console.error('Error getting password data: ', err);
        } else if (result) {            
            window.currentPassword = result;
            console.log('Password: ', result); 
            alert('File Password is: ' + result);            
        } else {
            console.error('No password data. Transaction not mined yet?');
        }
    });
}

// Get the file location[i] back from Smart Contract
function getFileLocation(providerAddress) {
    if (!window.contractInstance) {
        console.error('Make sure you deploy your contract first');
        return;
    }
    window.contractInstance.getFileLocation.call(providerAddress, function(err, result){
        if (err) {
            console.error('Error getting IPFS data: ', err);
        } else if (result) {            
            window.currentData = result;
            display(window.currentData);
            console.log('IPFS data: ', result); 
            alert('IPFS data: ' + result);            
        } else {
            console.error('No IPFS data. Transaction not mined yet?');
        }
    });
}

// IPFS stuff
// store the file on IPFS
function store() {
  const file = document.getElementById('source').files[0];
  const reader = new FileReader();
  reader.onload = function () {
    var toStore = new Buffer(reader.result);
    ipfs.add(toStore, function (err, res) {
      if (err || !res) {
        return console.error('ipfs add error', err, res);
      }
      res.forEach(function (file) {
        console.log('successfully stored', file);
        display(file.path);
        // save the IPFS location
        window.currentData = file.path;
      })
    })
  }
  reader.readAsArrayBuffer(file);
}

// display the address once store was successful
function display(hash) {
  document.getElementById('hash').innerHTML =
    "<a href='http://" + ipfsHost + ":" + ipfsWebPort + "/ipfs/" + hash + "'>" + hash + "</a>"
}

// login with different accounts
function loginAccount() {
    var text, account, loginOK;
    var accountPassword    = 'khodam20';
    var accountName = prompt("What's your login?");
    switch(accountName) {
    case "patient":
        text = "Patient";  
        // set up the right account
        account = web3.eth.accounts[0];  
        loginOK = true; 
        // hide/show
        $("#loadContract").hide();
        $("#deployContract").show();
        $("#enableWrite").show();
        $("#enableRead").show();
        //
        $("#savePassword").show();
        $("#retrievePassword").show();
        $("#retrieveFile").show();
        //
        break;   
    case "drWRITE":
        text = "Dr. WRITE";       
        // set up the right account
        account = web3.eth.accounts[1];
        loginOK = true;
        // hide/show
        $("#loadContract").show();
        $("#deployContract").hide();
        $("#enableWrite").hide();
        $("#enableRead").hide();
        //
        $("#savePassword").show();
        $("#retrievePassword").hide();
        $("#retrieveFile").hide();        
        //
        break;
    case "drREAD":
        text = "Dr. READ";        
        // set up the right account
        account = web3.eth.accounts[2];
        loginOK = true;
        // hide/show
        $("#loadContract").show();
        $("#deployContract").hide();
        $("#enableWrite").hide();
        $("#enableRead").hide();
        //
        $("#savePassword").hide();
        $("#retrievePassword").show();
        $("#retrieveFile").show();
        //
        document.getElementById('hash').innerHTML = "[ipfs hash]"
        //
        break;
    default:
        text = "[login again!]";   
        loginOK = false; 
        // hide/show
        $("#loadContract").hide();
        $("#deployContract").hide();
        $("#enableWrite").hide();
        $("#enableRead").hide();
        //
        $("#savePassword").hide();
        $("#retrievePassword").hide();
        $("#retrieveFile").hide();
        //    
    }
    if (loginOK) {
        // unlock the account first
        web3.personal.unlockAccount(account, accountPassword, 1000);

        // launch the contract
        var deployContractObject = {
            from: account,
            gas: 4700000,
            data: bytecode
        };

        // put data on the Blockchain
        var sendDataObject = {
            from: account, 
            gas: 4700000
        };

        window.account = account;
        window.deployContractObject = deployContractObject;
        window.sendDataObject = sendDataObject;
        alert("Logged successfully." + text + " account is unlocked!");
    }
    document.getElementById("loginName").innerHTML = text;    

}

// DOM stuff
// add the store function to store file button 
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('loadContract').onclick = function() {
      //disable
      this.disabled = true;
      // contract address 0x6a8c4c735db946d6c3c6b8dc0a40e25c24ccd795
      loadContract(window.contractAddress);
      this.disabled = false;
      //do some validation stuff
  }
  //
  //document.getElementById('loadContract').onload = function() {
  //    $("#loadContract").hide();
  //}
  //
  document.getElementById('enableWrite').onclick = function() {
      //disable
      this.disabled = true;
      // contract address 0x5e2815a81f568020c0f50e5f2ed34cd8ba309cf9
      giveWriteOnlyAccessTo(web3.eth.accounts[1]);
      this.disabled = false;
      //do some validation stuff
  }
  //
  //
  document.getElementById('enableRead').onclick = function() {
      //disable
      this.disabled = true;
      // contract address 0x5e2815a81f568020c0f50e5f2ed34cd8ba309cf9
      giveReadOnlyAccessTo(web3.eth.accounts[2]);
      this.disabled = false;
      //do some validation stuff
  }
  //
  document.getElementById('loginAccount').onclick = function() {
    //disable
    this.disabled = true;
    loginAccount();
    this.disabled = false;
    //do some validation stuff
  }
  //
  document.getElementById('deployContract').onclick = function() {
    //disable
    this.disabled = true;
    deployContract();
    this.disabled = false;
    //do some validation stuff
  }
  //
  document.getElementById('storeIPFS').onclick = function() {
    //disable
    this.disabled = true;
    store();
    this.disabled = false;
    //do some validation stuff
  }
  //
  document.getElementById('savePassword').onclick = function() {
    //disable
    this.disabled = true;
    saveFileLocationWithPassword(window.currentPassword, window.currentData);
    this.disabled = false;
    //do some validation stuff
  }
  //
  document.getElementById('retrievePassword').onclick = function() {
    //disable
    this.disabled = true;
    getPassword(web3.eth.accounts[1]);
    this.disabled = false;
    //do some validation stuff
  }
  //
  document.getElementById('retrieveFile').onclick = function() {
    //disable
    this.disabled = true;    
    getFileLocation(web3.eth.accounts[1]);    
    this.disabled = false;
    //do some validation stuff
  }
  
  //
})