class App extends React.Component {
    constructor (){
        super ()
        this.state = {view: 'landing'}
    }
    render() {
        return <React.Fragment>
            {this.state.view === 'landing' && <Landing 
            OnSignIn={() => this.setState({view: 'signin'})}
            OnSignUp={() => this.setState({view: 'signup'})}
            ></Landing>}
            
            {this.state.view === 'signup' && 
                <SignUp
                OnSignIn={() => this.setState({view: 'signin'})}
                OnSignUp={(name, lastName, username, password, checkbox) =>{
                    try {
                        signUpUser(name, lastName, username, password, checkbox, (error) => {
                            if (error) {
                                alert(error.message)
                                return
                            }
                            this.setState({view: 'thank-you'})
                
                        })
                    } catch (error) {
                        alert(error.message)
                    }
                }}
                ></SignUp>}
            
            {this.state.view === 'thank-you' && 
                <ThankYou
                OnSignIn={() => this.setState({view: 'signin'})}
                ></ThankYou>}

            {this.state.view === 'signin' && 
                <SignIn
                OnSignUp={() => this.setState({view: 'signup'})}
                OnSignIn={(username, password) => {
                    try {
                        signInUser(username, password, (error, token) => {
                            if (error) {
                                alert(error.message)
                                
                                return
                            }
                
                            sessionStorage.token = token
            
                            this.setState({view: 'home'})
                        })
                    } catch (error) {
                        alert(error.message)
                    }
                }}
                ></SignIn>}

            {this.state.view === 'home' && <Home></Home>}
                
                
                
        </React.Fragment>
    }
}