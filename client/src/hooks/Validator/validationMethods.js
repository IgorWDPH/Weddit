export const validationMethods = {
    minLength: (value, conf) => {
        const minLnght = parseInt(conf.lnght);
        if(isNaN(minLnght)) {
            console.log(`ERROR: minLnght must be a number, ${minLnght} given!`);
            return;
        }
        if(value.length < minLnght) {
            if(conf.message) return conf.message;
            return `It must be ${minLnght} characters as min!`;
        }
        return;
    },    
    maxLength: (value, conf) => {
        const maxLength = parseInt(conf.lnght);        
        if(isNaN(maxLength)) {
            console.log(`ERROR: maxLength must be a number, ${maxLength} given!`);
            return;
        }
        if(value.length > maxLength) {
            if(conf.message) return conf.message;
            return `It must be ${maxLength} characters max!`;
        }
        return;
    },    
    email: (value, conf) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(!value || !re.test(String(value).toLowerCase())) {
            if(conf.message) return conf.message;
            return `Email is invalid!`;
        }
        return;     
    },
    password: (value, conf) => {
        const re = /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
        if(!re.test(String(value))) {
            if(conf.message) return conf.message;
            return `Password is not strong enough! It must be at least 1 lowercase alphabetical character, at least 1 uppercase alphabetical character, at least 1 numeric character and it must be eight characters or longer.`;
        }
        return;
    },
    password_repeat: (value, conf) => {
        if(value !== conf.password) {
            if(conf.message) return conf.message;
            return 'Passwords are not much!';
        }
        return;
    },
    lettersAndNumbers: (value, conf) => {
        const re = /[^A-Za-z0-9]+/;
        if(re.test(String(value))) {
            if(conf.message) return conf.message;
            return `You must use only letters and numbers`;
        }
    }
}