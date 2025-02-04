import React, { Component } from 'react';
import validator from 'validator';
import _ from 'lodash';
import { connect } from 'react-redux';
import ImagePicker from 'react-native-image-picker';
import {
  Alert,
	StyleSheet,
	TouchableWithoutFeedback,
} from 'react-native';
import { setUser } from '../../redux/action/auth'
import {
    View,
    Button,
    Item,
    Label,
    Input,
    Container,
    Content,
    Form,
    Text,
    Grid,
    Col,
    Picker,
    Thumbnail,
    Spinner
} from 'native-base';
import Dimensions from '../../utils/dimensions';
import HeaderView from '../../components/HeaderView';
import estados from '../../utils/estados';
import applyMask, { brPhone, unMask, brCpf, brCep }  from '../../utils/maks';
import { colors } from '../../themes'
import { withNavigation } from 'react-navigation'
import * as firebase from 'firebase'
// import uuid from 'uuid/v1'
import moment from 'moment'
import VMasker from 'vanilla-masker'

import axios from 'axios'

const options = {
  title: 'TIRE UMA FOTO DE PERFIL',
  customButtons: [{ name: 'fb', title: 'ESCOLHA DO FACEBOOK' }],
  storageOptions: {
    skipBackup: true,
    path: 'images',
	},
	quality: 0.2,
	// allowsEditing: false, 
	maxWidth: 200, maxHeight: 200
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff'
  },
  holder: {
    padding: Dimensions.padding
  },
  logoTextHolder: {
    alignItems: 'center',
    padding: 20
  },
  logoText: {
    fontSize: 22,
    marginTop: 10
  },
  item: {
    margin: 10
  },
  itemTitle: {
    color: '#666666',
    paddingBottom: 10
  },
  itemContent: {
    paddingLeft: 6,
    paddingBottom: 10
  },
  itemUnderline: {
    flex: 1,
    height: 1,
    backgroundColor: '#cccccc'
  },
  itemRow: {
    flex: 1,
    marginTop: 20,
    marginBottom: 10,
    flexDirection: 'row'
  },
  termsText: {
    marginLeft: 20,
    fontSize: 14,
    color: '#888888'
  },
  signUpButton: {
    marginVertical: 20,
    backgroundColor: colors.button.primary
  },
  signUpButtonText: {
    color: colors.text.footer
  },
  loginButton: {
    marginTop: 10,
    marginBottom: 10
  },
  loginButtonText: {
    color: '#888888'
  },
  loginButtonTextBold: {
    color: '#888888',
    fontWeight: 'bold'
  },
  logoTextHolder: {
    alignItems: 'center',
    marginTop: 40
  },
  logoText: {
		fontWeight: 'bold',
		padding: 10
	},
	subLabel: {
		textAlign: 'center',
		fontSize: 14,
		color: '#ccc',
		padding: 8
  },
  cepButton: {
    backgroundColor: colors.standardButton
  }
});

class RegisterScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {

			// user register variables
			location: {},
      profilePhoto: {},
      photo64: '',
			password: '',
			cpf: '',
      birthday: '',
      phone: '',
			telefone: '',
			email: '',
			dddphone: '',
			nome: '',
			enderecoLogradouro: '',
			enderecoNumero: '',
			enderecoBairro: '',
			enderecoLocalidade: '',
			enderecoComplemento: '',
			enderecoEstado: '',

			//bank data
			bank: '',
			bankAgency: '',
			bankAgencyDigit: '',
			bankAccount: '',
			bankAccountDigit: '',

			// flags
      terms: false,
      isLoading: false
    };
	}
	
  async componentDidMount(){
    const { user } = this.props
    console.log('current user do will', user)
    if(user){
      this.setState({
        oldUser: true,
				name: user.nome,
        dddphone: user.dddCelular,
        birthday: user.birthday,
        telefone:  user.telefone,
        email: user.email,
        enderecoNumero: user.enderecoNumero ? user.enderecoNumero : '',
				enderecoLogradouro: user.endereco ? user.endereco  : '',
				enderecoLocalidade: user.cidade ? user.cidade : '',
				enderecoBairro: user.bairro ?  user.bairro : '',
				enderecoComplemento: user.enderecoComplemento ? user.enderecoComplemento : '',
				profilePhoto: user.photo64 && user.photo64.length > 0 ? `data:image/png;base64,${u.photo64}` : '',
				bank: user.bank ? user.bank : '',
				bankAgency: user.bankAgency ? user.bankAgency : '',
				bankAgencyDigit: user.bankAgencyDigit ? user.bankAgencyDigit : '',
				bankAccount: user.bankAccount ? user.bankAccount : '',
				bankAccountDigit: user.bankAccountDigit ? user.bankAccountDigit : '',
        cpf: user.cpf,
        photo: user.photo ? user.photo : ''
      })
    }
  }
   
      // await firebase.storage().ref(`profile/photo/${this.props.user.id}`).child('profile_photo').getDownloadURL()
        // .then(url => {
        //   console.log('axios url', url)
        //   axios.get(url)
        //     .then(response => {
        //       console.log('response do axios', response)
        //       this.setState({ photo64:  response.data })
        //     })
        //     .catch(error => {
        //       console.log('error retrieving photo from user', error)
        //     })
        // })

  onClickBackButton = () => {
    return this.props.navigation.goBack()
  };

  onClickTermsButton = () => {
    const { history } = this.props;
    history.push(Paths.terms);
  }

  getPhoneNumberWithCountryCode = phone => `+55${phone}`;

  showWarningAlert = (message) => {
    Alert.alert('Atenção', message);
  };

  toggleLoading = (loading) => {
    this.setState({ isLoading: loading });
  }

  validateEmail = email => validator.isEmail(email);

  validateFieldsAndRegister = () => {
    const {
			telefone,
      email,
			password,
      passwordConf,
      enderecoLogradouro,
      enderecoNumero,
      enderecoBairro,
      enderecoLocalidade,
    } = this.state;

    console.log('procurando undefined', this.state)

		let validPhone = false;
		
    if (telefone && telefone.length >= 14) {
      validPhone = true;
		}
		
    let validEmail = false;
    if (validator.isEmail(email)) {
      validEmail = true;
    }

    if (!validEmail && !validPhone) {
      this.showWarningAlert('É obrigratório preencher ao menos o telefone ou o e-mail');
      return;
    }

    if (validEmail) {
      if (!validPhone) {
        this.showWarningAlert('Telefone inválido');
        return;
      }
    }

    if (validPhone) {
      if (!validEmail && email && email.length > 0) {
        this.showWarningAlert('E-mail inválido');
        return;
      }
    }
    
    //validate only if old user
    if(this.state.oldUser){
      if (enderecoBairro.length < 4) {
        this.showWarningAlert('Bairro inválido');
        return;
      }

      if(enderecoLocalidade && enderecoLocalidade.length < 3) {
        this.showWarningAlert('Cidade inválida');
        return;
      }

      if (enderecoLogradouro && enderecoLogradouro.length < 5) {
        this.showWarningAlert('Endereço inválido');
        return;
      }

      if (enderecoNumero && enderecoNumero.length < 1) {
        this.showWarningAlert('Número inválido');
        return;
      }
    }
		this.signup()
	};
	
	signup = async () => {
    const { 
       photo64,
       email,
			 password,
			 telefone,
				dddphone,
				name,
				birthday,
				enderecoEstado,
				enderecoLogradouro,
				enderecoNumero,
				enderecoBairro,
				enderecoLocalidade,
				enderecoComplemento,
				bank,
				bankAgency,
				bankAgencyDigit,
				bankAccount,
				bankAccountDigit,
				cpf,
       } = this.state

		let currentUser = {
			photo64,
			nome: name,
			email,
			dddphone,
			telefone,
			estado: enderecoEstado,
			endereco: enderecoLogradouro,
			numero: enderecoNumero,
			bairro: enderecoBairro,
			cidade: enderecoLocalidade,
			complemento: enderecoComplemento,
			bank,
			birthday,
			bankAgency,
			bankAgencyDigit,
			bankAccount,
			bankAccountDigit,
			cpf,
      updatedAt: moment().format('DD/MM/YYYY HH:mm:ss'),
    }
    this.setState({ isLoading: true })
			await firebase.database().ref(`register/commerce/motoboyPartner/${this.props.user.id}`)
        .update({
					...currentUser,
				})
        .then(() => {
          console.log('User info updated successfully')
          this.setState({ isLoading: false })
          Alert.alert('Atenção', 'Seus dados pessoais foram atualizados com sucesso')
          this.props.setUser(currentUser) // update redux curret user with new info
        })
        .catch(err => {
          console.log('Error uptading user info', err)
          this.setState({ isLoading: false })
          Alert.alert('Ops :(', 'Algo deu errado. Tenta novamente mais tarde.')
        })
    }

  focusInput(inputField) {
    this[inputField]._root.focus();
  }

  handleSearchCepButtonClick = () => {
    this.setState({ isLoading: true });

    fetch(`https://viacep.com.br/ws/${unMask(this.state.enderecoCep)}/json/`)
      .then(response => response.json())
      .then((response) => {
        if (response.erro) {
          this.setState({
            isLoading: false,
            enderecoLogradouro: '',
            enderecoBairro: '',
            enderecoLocalidade: '',
            enderecoEstado: ''
          }, () => { this.validateCep(response); });
        } else {
          this.setState({
            isLoading: false,
            enderecoLogradouro: response.logradouro,
            enderecoBairro: response.bairro,
            enderecoLocalidade: response.localidade,
            enderecoEstado: response.uf
          });
        }
      })
      .catch((err) => {
        this.setState({
          isLoading: false
        });
      });
	}
	
  selectPhoto = async () => {
    /**
   * The first arg is the options object for customization (it can also be null or omitted for default options),
   * The second arg is the callback which sends object: response (more info in the API Reference)
   */
    await ImagePicker.launchCamera(options, async (response) => {
      this.setState({ 
        isLoading: true
      })
      console.log('response da photo', response)
      if (response.didCancel) {
        this.setState({ isLoading: false })
        console.log('User cancelled image picker');
      } else if (response.error) {
        this.setState({ isLoading: false })
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        this.setState({ isLoading: false })
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };
        console.log('source da photo', source)
        this.setState({
          photo64: response.data,
          profilePhoto: source
        });
      }
      const image = `data:image/jpeg;base64,${response.data}`
      await firebase.database().ref(`register/commerce/motoboyPartner/${this.props.user.id}`).update({
        photo: image
      })
        .then(() => {
          Alert.alert('Atenção', 'Foto de perfil atualizada com sucesso')
          this.setState({ isLoading: false })
        })
        .catch(error => {
          console.log('error saving perfil foto', error)
          Alert.alert('Atenção', 'Houve um erro ao salvar sua foto. Tente novamente ou entre em contato com nosso suporte')
        })
    })
  }

	handleEstadoChange = (estado) => {
		this.setState({ enderecoEstado: estado })
  }
  
  validateCep(response) {
    if (this.state.enderecoCep) {
      if (!unMask(this.state.enderecoCep).match(/^[0-9]{8}$/) || response.erro) {
        Alert.alert('Atenção', 'CEP inválido');
      }
    }
  }

  handleBirthday = param => {
    let birthday = VMasker.toPattern(param, '99/99/9999')
    this.setState({ birthday })
  }

  render() {
    console.log('user', this.props.user, this.state.photo)
    const { isLoading } = this.state;
    const { user } = this.props
    return (
      <Container style={styles.container} pointerEvents={isLoading ? 'none' : 'auto'}>
        <HeaderView
          title={'Minha Conta' }
          onBack={this.onClickBackButton}
        />
        {isLoading ? (
          <Spinner />
        ) : (
          <Content style={styles.holder} keyboardShouldPersistTaps="handled">
					<View style={{ alignItems: 'center'}}> 
						<Label style={styles.logoText}>Perfil</Label>
						<TouchableWithoutFeedback onPress={() => this.selectPhoto()}>
              <Thumbnail
                large
                source={this.state.photo && this.state.photo.length > 0 ? {uri: `${this.state.photo}`} : require('../../assets/avatar.png')} />
						</TouchableWithoutFeedback>
						<Text style={styles.subLabel}> Clique e selecione uma foto de perfil </Text>
					</View>
				  <View>
            <Form>
              <Item
                stackedLabel
              >
                <Label>Nome Completo</Label>
                <Input
                  autoCapitalize="words"
                  onChangeText={name => this.setState({ name })}
                  returnKeyType="next"
                  value={this.state.name}
                  onSubmitEditing={() => this.focusInput('phoneInput')}
                />
              </Item>
              <Item
                stackedLabel
              >
                <Label>Telefone</Label>
                <Input
                  ref={(c) => { this.phoneInput = c; }}
                  onSubmitEditing={() => this.focusInput('emailInput')}
                  returnKeyType="next"
                  onChangeText={applyMask(this, 'telefone', brPhone)}
                  value={this.state.telefone}
                  keyboardType="phone-pad"
                />
              </Item>
              <Item
                stackedLabel
              >
                <Label>E-mail</Label>
                <Input
                  ref={(c) => { this.emailInput = c; }}
                  onSubmitEditing={() => this.focusInput('birthday')}
                  returnKeyType="next"
                  autoCapitalize="none"
                  onChangeText={email => this.setState({ email })}
                  value={this.state.email}
                  keyboardType="email-address"
                />
              </Item>
              <Item
                stackedLabel
              >
                <Label>Data de nascimento</Label>
                <Input
                  ref={(c) => { this.birthday = c; }}
                  onSubmitEditing={() => this.focusInput('cepInput')}
                  returnKeyType="next"
                  autoCapitalize="none"
                  onChangeText={birthday => this.handleBirthday(birthday)}
                  value={this.state.birthday}
                />
              </Item>
							<Grid>
              <Col style={{ flex: 0.6 }}>
                <Item
                  stackedLabel
                >
                  <Label>CEP</Label>
                  <Input
                    ref={(c) => { this.cepInput = c; }}
                    onEndEditing={() => this.handleSearchCepButtonClick()}
                    returnKeyType="next"
                    keyboardType="phone-pad"
                    onChangeText={applyMask(this, 'enderecoCep', brCep)}
                    value={this.state.enderecoCep}
                  />
                </Item>
              </Col>
              <Col
                style={{
                  flex: 0.4,
                  marginLeft: 10,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Button
                  block
                  style={styles.cepButton}
                  onPress={this.handleSearchCepButtonClick}
                >
                  <Text>
                    Buscar
                  </Text>
                </Button>
              </Col>
            </Grid>
            <Grid>
              <Col style={{ flex: 0.7 }}>
                <Item
                  stackedLabel
                >
                  <Label>Logradouro</Label>
                  <Input
                    ref={(c) => { this.enderecoLogradouroInput = c; }}
                    onSubmitEditing={() => this.focusInput('enderecoNumeroInput')}
                    returnKeyType="next"
                    onChangeText={enderecoLogradouro => this.setState({ enderecoLogradouro })}
                    value={this.state.enderecoLogradouro}
                  />
                </Item>
              </Col>
              <Col style={{ flex: 0.3 }}>
                <Item
                  stackedLabel
                >
                  <Label>Nº</Label>
                  <Input
                    ref={(c) => { this.enderecoNumeroInput = c; }}
                    onSubmitEditing={() => this.focusInput('enderecoBairroInput')}
                    returnKeyType="next"
                    onChangeText={enderecoNumero => this.setState({ enderecoNumero })}
                    value={this.state.enderecoNumero || ''}
                  />
                </Item>
              </Col>
            </Grid>
            <Item
              stackedLabel
            >
              <Label>Bairro</Label>
              <Input
                ref={(c) => { this.enderecoBairroInput = c; }}
                onSubmitEditing={() => this.focusInput('enderecoLocalidadeInput')}
                returnKeyType="next"
                onChangeText={enderecoBairro => this.setState({ enderecoBairro })}
                value={this.state.enderecoBairro}
              />
            </Item>
            <Grid>
              <Col style={{ flex: 0.7 }}>
                <Item
                  stackedLabel
                >
                  <Label>Cidade</Label>
                  <Input
                    ref={(c) => { this.enderecoLocalidadeInput = c; }}
                    onSubmitEditing={() => this.focusInput('enderecoEstadoInput')}
                    returnKeyType="next"
                    onChangeText={enderecoLocalidade => this.setState({ enderecoLocalidade })}
                    value={this.state.enderecoLocalidade}
                  />
                </Item>
              </Col>
              <Col style={{ flex: 0.3 }}>
                <View style={styles.estadoContainer}>
                  <Picker
                    mode="dropdown"
                    placeholder="Estado"
                    selectedValue={this.state.enderecoEstado}
                    onValueChange={this.handleEstadoChange}
                  >
                    {estados.map(estado =>
                      <Item key={estado.sigla} label={estado.sigla} value={estado.sigla} />)}
                  </Picker>
                </View>
              </Col>
            </Grid>
						{/* <Item
              stackedLabel
            >
              <Label>Banco</Label>
              <Input
                ref={(c) => { this.bank = c; }}
                onSubmitEditing={() => this.focusInput('bankAgency')}
                returnKeyType="next"
                onChangeText={bank => this.setState({ bank })}
                value={this.state.bank || ''}
              />
            </Item>
						<Grid>
              <Col style={{ flex: 0.7 }}>
                <Item
                  stackedLabel
                >
                  <Label>Agência</Label>
                  <Input
                    ref={(c) => { this.bankAgency = c; }}
                    onSubmitEditing={() => this.focusInput('bankAgencyDigit')}
                    returnKeyType="next"
                    onChangeText={bankAgency => this.setState({ bankAgency })}
                    value={this.state.bankAgency || ''}
                  />
                </Item>
              </Col>
              <Col style={{ flex: 0.3 }}>
                <Item
                  stackedLabel
                >
                  <Label>Dígito</Label>
                  <Input
                    ref={(c) => { this.bankAgencyDigit = c; }}
                    onSubmitEditing={() => this.focusInput('bankAccount')}
                    returnKeyType="next"
                    onChangeText={bankAgencyDigit => this.setState({ bankAgencyDigit })}
                    value={this.state.bankAgencyDigit || ''}
                  />
                </Item>
              </Col>
            </Grid>
						<Grid>
              <Col style={{ flex: 0.7 }}>
                <Item
                  stackedLabel
                >
                  <Label>Conta-corrente</Label>
                  <Input
                    ref={(c) => { this.bankAccount = c; }}
                    onSubmitEditing={() => this.focusInput('bankAccountDigit')}
                    returnKeyType="next"
                    onChangeText={bankAccount => this.setState({ bankAccount })}
                    value={this.state.bankAccount || ''}
                  />
                </Item>
              </Col>
              <Col style={{ flex: 0.3 }}>
                <Item
                  stackedLabel
                >
                  <Label>Dígito</Label>
                  <Input
                    ref={(c) => { this.bankAccountDigit = c; }}
                    returnKeyType="done"
                    onChangeText={bankAccountDigit => this.setState({ bankAccountDigit })}
                    value={this.state.bankAccountDigit || ''} 
                  />
                </Item>
              </Col>
            </Grid> */}
              <Item
                stackedLabel
              >
                <Label>CPF</Label>
                <Input
                  ref={(c) => { this.cpfInput = c; }}
                  returnKeyType="next"
                  onChangeText={applyMask(this, 'cpf', brCpf)}
                  value={this.state.cpf}
                  keyboardType="number-pad"
                />
              </Item>
              {/* <Item
                stackedLabel
              >
                <Label>Senha</Label>
                <Input
                  ref={(c) => { this.passwordInput = c; }}
                  onSubmitEditing={() => this.focusInput('passwordConfirmInput')}
                  returnKeyType="next"
                  secureTextEntry
                  onChangeText={password => this.setState({ password })}
                  value={this.state.password}
                />
              </Item>
              <Item
                stackedLabel
              >
                <Label>Confirmar senha</Label>
                <Input
                  ref={(c) => { this.passwordConfirmInput = c; }}
                  returnKeyType="next"
                  secureTextEntry
                  onChangeText={passwordConf => this.setState({ passwordConf })}
                  value={this.state.passwordConf}
                />
              </Item> */}
              {/* <View
                style={styles.itemRow}
                onTouchStart={() => this.setState({ terms: !this.state.terms })}
              >
                <CheckBox color="#888888" checked={this.state.terms} />
                <Label style={styles.termsText}>
                  Aceito os termos e condições
                </Label>
              </View> */}
              {/* <View>
                <Button
                  transparent
                  block
                  style={styles.loginButton}
                  onPress={this.onClickTermsButton}
                >
                  <Text style={styles.loginButtonText}>Ver termos e condições</Text>
                </Button>
              </View> */}
            </Form>
            <Button
              block
              style={styles.signUpButton}
              onPress={this.validateFieldsAndRegister}
            >
              <Text>Atualizar</Text>
            </Button>
          </View>
        </Content>
        )}
      </Container>
    );
  }
}

const mapStateToProps = state => ({
	user: state.user.user,
})

export default connect(mapStateToProps, { setUser })(withNavigation(RegisterScreen))

