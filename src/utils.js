import { Platform, PixelRatio, AsyncStorage, Alert } from 'react-native'

export function getPixelSize(pixels){
    return Platform.select({
        ios: pixels,
        android: PixelRatio.getPixelSizeForLayoutSize(pixels)
    })
}

export const countDown = () => {

	var timeleft = 10;
	var downloadTimer = setInterval(() => {
		timeleft--
		console.log(timeleft)
		// this.setState({ time: parseInt(timeleft)} )
			if(timeleft === 0 ){
				clearInterval(downloadTimer);
			}
	}, 1000);
	return timeLeft
		
}

export const setId = async userId => {
    try {
      await AsyncStorage.setItem('userId', userId);
    } catch (error) {
      // Error retrieving data
      console.log(error.message);
    }
  };

export const getId = async () => {
    let userId = '';
    try {
      userId = await AsyncStorage.getItem('userId') || 'none';
    } catch (error) {
      // Error retrieving data
      console.log(error.message);
    }
    return userId;
  }

export const recover = async (id) => {
	await firebase.database().ref(`register/commerce/motoboyPartner/${motoboy.id}`).update({
				activeRide: false,
				ride: false,
				rideId: false,
				onRide: false,
			}) 
			.then(() => {
					Alert.alert('Olá','Seja bem vindo novamente!')
			})
			.catch((error) => {
					console.log('recover failed.', error)
			})
}
