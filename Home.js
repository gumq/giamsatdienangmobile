import React, { useEffect, useState, useRef } from 'react';
import {
  SafeAreaView,
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import axios from 'axios';
import { Formik } from 'formik';
import * as Yup from 'yup';

const API_URL = 'https://giamsatdn-gumq-gumqs-projects.vercel.app/data/';
const Key = '?_vercel_share=EbSXF9WBOb9tVcify2GarGftOIRzCE76';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').heigh;
const Home = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [dateTime, setDateTime] = useState('');
  const [voltage, setVoltage] = useState('');
  const [current, setCurrent] = useState('');
  const [power, setPower] = useState('');
  const [energy, setEnergy] = useState('');
  const [frequency, setFrequency] = useState('');
  const [powerFactor, setPowerFactor] = useState('');

  const flatListRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true); 
    try {
      const response = await axios.get(API_URL + Key);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data: ', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(API_URL + id + Key);
      fetchData();
    } catch (error) {
      console.error('Error deleting data: ', error);
    }
  };

  const updateItem = async (id, newData) => {
    const body = {
      id: id,
      DateTime: newData.DateTime,
      Voltage: newData.Voltage,
      Current: newData.Current,
      Power: newData.Power,
      Energy: newData.Energy,
      Frequency: newData.Frequency,
      PowerFactor: newData.PowerFactor,
    };
    try {
      await axios.post(API_URL + 'update' + Key, body);
      fetchData();
    } catch (error) {
      console.error('Error updating data: ', error);
    }
  };

  const handleUpdate = (item) => {
    setSelectedItem(item);
    setDateTime(item.DateTime);
    setVoltage(item.Voltage.toString());
    setCurrent(item.Current.toString());
    setPower(item.Power.toString());
    setEnergy(item.Energy.toString());
    setFrequency(item.Frequency.toString());
    setPowerFactor(item.PowerFactor.toString());
    setModalVisible(true);
  };

  const validationSchema = Yup.object().shape({
    DateTime: Yup.string().required('DateTime is required'),
    Voltage: Yup.number()
      .required('Voltage is required')
      .positive('Voltage must be positive'),
    Current: Yup.number()
      .required('Current is required')
      .positive('Current must be positive'),
    Power: Yup.number()
      .required('Power is required')
      .positive('Power must be positive'),
    Energy: Yup.number()
      .required('Energy is required')
      .positive('Energy must be positive'),
    Frequency: Yup.number()
      .required('Frequency is required')
      .positive('Frequency must be positive'),
    PowerFactor: Yup.number()
      .required('PowerFactor is required')
      .positive('PowerFactor must be positive'),
  });

  const onSubmit = async (values, { resetForm }) => {
    try {
      await updateItem(selectedItem.id, values);
      resetForm();
      setModalVisible(false);
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const renderItem = ({ item,index }) => (
    <TouchableOpacity key ={index}style={styles.item} onPress={() => handleUpdate(item)}>
      <View style={{flexDirection:'row',flex:1}}>
      <View style={{flexDirection:'column'}}>
      <Text style={styles.itemText}>ID: {item.id}</Text>
      <Text style={styles.itemText}>DateTime: {item.DateTime}</Text>
      <Text style={styles.itemText}>Voltage: {item.Voltage} V</Text>
      <Text style={styles.itemText}>Current: {item.Current} A</Text>
      <Text style={styles.itemText}>Power: {item.Power} W</Text>
      <Text style={styles.itemText}>Energy: {item.Energy} Wh</Text>
      <Text style={styles.itemText}>Frequency: {item.Frequency} Hz</Text>
      <Text style={styles.itemText}>PowerFactor: {item.PowerFactor} UN</Text></View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={() => confirmDelete(item.id)}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
      </View>
    </TouchableOpacity>
  );
  if (loading) {
    return (
      <SafeAreaView style={styles.containerLoding}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );}
  const confirmDelete = (id) => {
    Alert.alert(
      'Xác nhận xóa?',
      'Bạn có chắn chắn muốn xóa',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => deleteItem(id),
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const scrollToTop = () => {
    flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.refreshButton} onPress={fetchData}>
        <Text style={styles.refreshButtonText}>Refresh</Text>
      </TouchableOpacity>
      <FlatList
        ref={flatListRef}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <TouchableOpacity style={styles.scrollToTopButton} onPress={scrollToTop}>
        <Text style={styles.scrollToTopText}>Scroll to top</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
             <TouchableWithoutFeedback
            onPress={event => {
              if (event.target === event.currentTarget) {
                setModalVisible(false);
              }
            }}>
        <View style={styles.modalContainer}>
          <Formik
            initialValues={{
              DateTime: dateTime,
              Voltage: voltage,
              Current: current,
              Power: power,
              Energy: energy,
              Frequency: frequency,
              PowerFactor: powerFactor,
            }}
            validationSchema={validationSchema}
            onSubmit={onSubmit}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <View style={styles.modalContent}>
                <Text style={{ color: 'black', marginBottom: 10 }}>
                  ID: {selectedItem ? selectedItem.id : ''}
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="DateTime"
                  onChangeText={handleChange('DateTime')}
                  onBlur={handleBlur('DateTime')}
                  value={values.DateTime}
                />
                {touched.DateTime && errors.DateTime && (
                  <Text style={styles.errorText}>{errors.DateTime}</Text>
                )}
                <TextInput
                  style={styles.input}
                  placeholder="Voltage"
                  onChangeText={handleChange('Voltage')}
                  onBlur={handleBlur('Voltage')}
                  value={values.Voltage}
                  keyboardType="numeric"
                />
                {touched.Voltage && errors.Voltage && (
                  <Text style={styles.errorText}>{errors.Voltage}</Text>
                )}
                <TextInput
                  style={styles.input}
                  placeholder="Current"
                  onChangeText={handleChange('Current')}
                  onBlur={handleBlur('Current')}
                  value={values.Current}
                  keyboardType="numeric"
                />
                {touched.Current && errors.Current && (
                  <Text style={styles.errorText}>{errors.Current}</Text>
                )}
                <TextInput
                  style={styles.input}
                  placeholder="Power"
                  onChangeText={handleChange('Power')}
                  onBlur={handleBlur('Power')}
                  value={values.Power}
                  keyboardType="numeric"
                />
                {touched.Power && errors.Power && (
                  <Text style={styles.errorText}>{errors.Power}</Text>
                )}
                <TextInput
                  style={styles.input}
                  placeholder="Energy"
                  onChangeText={handleChange('Energy')}
                  onBlur={handleBlur('Energy')}
                  value={values.Energy}
                  keyboardType="numeric"
                />
                {touched.Energy && errors.Energy && (
                  <Text style={styles.errorText}>{errors.Energy}</Text>
                )}
                <TextInput
                  style={styles.input}
                  placeholder="Frequency"
                  onChangeText={handleChange('Frequency')}
                  onBlur={handleBlur('Frequency')}
                  value={values.Frequency}
                  keyboardType="numeric"
                />
                {touched.Frequency && errors.Frequency && (
                  <Text style={styles.errorText}>{errors.Frequency}</Text>
                )}
                <TextInput
                  style={styles.input}
                  placeholder="PowerFactor"
                  onChangeText={handleChange('PowerFactor')}
                  onBlur={handleBlur('PowerFactor')}
                  value={values.PowerFactor}
                  keyboardType="numeric"
                />
                {touched.PowerFactor && errors.PowerFactor && (
                  <Text style={styles.errorText}>{errors.PowerFactor}</Text>
                )}
                <TouchableOpacity
                  style={[styles.button, styles.submitButton,{marginBottom:20,marginTop:10}]}
                  onPress={handleSubmit}>
                  <Text style={styles.buttonText}>Update</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </View></TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  containerLoding:{
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
  },
  item: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    marginBottom: 16,
    borderRadius: 10,elevation:1,shadowRadius:2,borderColor:'red',borderWidth:1
  },
  itemText: {
    marginBottom: 5,fontSize:15,color:'#000',fontWeight:'500'
  },
  buttonContainer: {
    flexDirection: 'row-reverse',flex:1
    
  },
  button: {
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  updateButton: {
    backgroundColor: 'blue',
  },
  deleteButton: {
    backgroundColor: 'red',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer: {
    width:windowWidth,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '100%',height:'100%',justifyContent:'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 20,
    marginBottom: 20,
    borderRadius: 8,
  },
  submitButton: {
    backgroundColor: 'green',
    padding: 20,
    elevation:5,borderRadius:8,
  },
  cancelButton: {
    backgroundColor: 'red',borderRadius:8,
    padding: 20,
    elevation:5
  },
  errorText: {
    color: 'red',
    marginBottom: 5,
  },
  refreshButton: {
    position: 'absolute',
    bottom: 130,
    right: 20,
    backgroundColor: 'white',
    padding: 20,
    paddingHorizontal:25,
    borderRadius: 100,
    zIndex: 1,
    elevation:5
  },
  refreshButtonText: {
    color: '#1E90FF',
    fontWeight: 'bold',
  },
  scrollToTopButton: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    backgroundColor: 'white',
    paddingHorizontal:10,
    paddingVertical: 20,  
    borderRadius: 120,
    zIndex: 1,elevation:5,
  },
  scrollToTopText: {
    color: '#1E90FF',
    fontWeight: 'bold',
  },
});

export default Home;
