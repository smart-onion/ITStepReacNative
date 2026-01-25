import { StyleSheet } from "react-native";

const AppStyles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    alignItems: 'center', 
    justifyContent: 'space-between',
    backgroundColor: '#444',
  },
  header: {
    paddingVertical: 9.5,
  },
  title:{
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  main:{
    width: '100%',
    flex: 1, 
    backgroundColor: 'salmon',
  },
    footer:{
        fontWeight: 'bold',
        fontSize: 24,
        color: '#fff',
        paddingVertical: 16,
        paddingHorizontal: 32,
        marginVertical: 16,
        backgroundColor: 'green',
        borderRadius: 7,
        borderWidth: 2,
        borderColor: '#9b8282ff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
      }
    
});
export default AppStyles;