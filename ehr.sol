pragma solidity ^0.4.0;
contract ControlAccess {

    struct Provider {
        string title;
        bool canRead;
        bool canWrite;
        string password;
        string ipfsHash;
    }
    
    mapping(address => Provider) public providers;
    
    // Only the Patient can add or remove providers
    address public patient;

    /// Set the patient
    function ControlAccess() {
        patient = msg.sender;
        // Always the patient has full access
        providers[patient].title = "patient";
        providers[patient].canRead = true;
        providers[patient].canWrite = true;
    }

    /// Give $(voter) the right to vote on this ballot.
    /// May only be called by $(patient).
    function giveWriteOnlyAccessTo(address provider, string title) {
        // Only patient can do that
        if (msg.sender != patient) throw;
        providers[provider].title = title;
        providers[provider].canWrite = true;
        providers[provider].canRead = false;
    }
    
    function giveReadOnlyAccessTo(address provider, string title) {
        // Only patient can do that
        if (msg.sender != patient) throw;
        providers[provider].title = title;
        providers[provider].canWrite = false;
        providers[provider].canRead = true;
    }
    
    function giveAllAccessTo(address provider, string title) {
        // Only patient can do that
        if (msg.sender != patient) throw;
        providers[provider].title = title;
        providers[provider].canWrite = true;
        providers[provider].canRead = true;
    }
    
    function revokeAllAccessFrom(address provider, string title) {
        // Only patient can do that
        if (msg.sender != patient) throw;
        providers[provider].title = title;
        providers[provider].canWrite = false;
        providers[provider].canRead = false;
    }
    
    function saveFileLocation(string password, string ipfsHash) {
        if (!providers[msg.sender].canWrite) throw;
        providers[msg.sender].password = password;
        providers[msg.sender].ipfsHash = ipfsHash;
    }

    // Can get the password for any provider with READ access
    function getPassword(address provider) constant returns (string password) {
        if (!providers[msg.sender].canRead) throw;
        return providers[provider].password;
    }
    
    // Can get the file location for any provider with READ access
    function getFileLocation(address provider) constant returns (string ipfsHash) {
        if (!providers[msg.sender].canRead) throw;
        return providers[provider].ipfsHash;
    }
    
    // Check READ access
    function hasReadAccess(address provider) constant returns (bool x) {
        if (providers[provider].canRead) 
            return true;
        else
            return false;
    }
    
    // Check WRITE access
    function hasWriteAccess(address provider) constant returns (bool x) {
        if (providers[provider].canWrite) 
            return true;
        else
            return false;
    }
}