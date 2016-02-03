import LocalizedStrings from 'react-native-localization';

const strings = new LocalizedStrings({
  en: {
    "Name": "Name",
    "Sign In": "Sign In",
    "Email": "Email",
    "Password": "Password",
    "Signup": "Sign Up",
    "Forgot Password": "Forgot Password",
    "Dont have an account?": "Dont have an account?",
    "Already have an account?": "Already have an account?",
    'Must use "@mckinsey.com" or "@external.mckinsey.com" email.': 'Must use "@mckinsey.com" or "@external.mckinsey.com" email.'
  },
  pt: {
    "Name": "Nome",
    "Sign In": "Entrar",
    "Email": "Email",
    "Password": "Password",
    "Signup": "Registar",
    "Forgot Password": "Esqueceste a Password",
    "Dont have an account?": "Não tens conta?",
    "Already have an account?": "Já estás registado?",
    'Must use "@mckinsey.com" or "@external.mckinsey.com" email.': 'Tens de usar o email "@mckinsey.com" ou "@external.mckinsey.com".'
  }
});

export default strings;