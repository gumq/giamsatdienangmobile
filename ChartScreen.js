import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Text, Dimensions, Button, Alert, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import axios from 'axios';

const API_URL = 'https://giamsatdn-gumq-gumqs-projects.vercel.app/data/';
const Key = '?_vercel_share=EbSXF9WBOb9tVcify2GarGftOIRzCE76';
const windowWidth = Dimensions.get('window').width;
const chartHeight = 500;

const dataFields = [
  { name: 'Voltage', color: '#FF6347',dv:'[V]' },
  { name: 'Current', color: '#1E90FF',dv:'[A]' },
  { name: 'Power', color: '#32CD32',dv:'[W]' },
  { name: 'Energy', color: '#FFD700',dv:'[Wh]' },
  { name: 'Frequency', color: '#8A2BE2',dv:'[Hz]' },
  { name: 'PowerFactor', color: '#FF4500' ,dv:'[UN]'},
];

const ChartScreen = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedField, setSelectedField] = useState(dataFields[0]); // Default to Voltage

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(API_URL + Key);
      const slicedData = response.data.slice(0, 10);
      const reversedData = slicedData.reverse();
      setData(reversedData);
    } catch (error) {
      console.error('Error fetching data: ', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setLoading(true); // Set loading state to true before fetching new data
    fetchData();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  const chartData = {
    labels: data.map(item => item.DateTime),
    datasets: [
      {
        data: data.map(item => parseFloat(item[selectedField.name])),
        color: (opacity = 1) => `rgba(${selectedField.color}, ${opacity})`,
      },
    ],
  };

  const handleDataPointClick = (data) => {
    const { value, dataset, index } = data;
    Alert.alert('Thông tin', `Giá trị: ${value}\nThời gian: ${chartData.labels[index]}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
        <Text style={styles.refreshButtonText}>Refresh</Text>
      </TouchableOpacity>
      <View style={styles.buttonContainer}>
        {dataFields.map(field => (
          <TouchableOpacity
            key={field.name}
            style={[styles.button, { backgroundColor: field.color }]}
            onPress={() => setSelectedField(field)}
          >
            <Text style={styles.buttonText}>{field.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Biểu đồ {selectedField.name} {selectedField.dv}</Text>
        <LineChart
          data={chartData}
          width={windowWidth - 30}
          height={chartHeight}
          fromZero={true}
          yAxisSuffix=""
          yAxisInterval={1}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
              marginTop: 20,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: selectedField.color,
            },
            propsForBackgroundLines: {
              strokeDasharray: '',
              strokeWidth: 1,
              stroke: '#e3e3e3',
            },
            propsForVerticalLabels: {
              fontSize: 10,
            },
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
          verticalLabelRotation={65}
          withOuterLines={false}
          withInnerLines={false}
          segments={8}
          yMax={Math.max(...data.map(item => parseFloat(item[selectedField.name]))) * 1.3}
          onDataPointClick={handleDataPointClick}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  button: {
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  refreshButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
  refreshButtonText: {
    color: '#1E90FF',
    fontWeight: 'bold',
  },
  chartContainer: {
    margin: 20,
    borderRadius: 0,
    backgroundColor: 'white',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2280b0',
  },
});

export default ChartScreen;
