import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location'; // Importamos el sensor

export default function App() {
  const [ubicacion, setUbicacion] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [cargando, setCargando] = useState(false);

  // Función para extraer las coordenadas del hardware
  const obtenerCoordenadas = async () => {
    setCargando(true);
    setErrorMsg(null);

    // 1. Pedir permiso al sistema operativo (Android/iOS)
    let { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      setErrorMsg('Permiso de ubicación denegado. Ve a ajustes.');
      setCargando(false);
      return;
    }

    // 2. Extraer posición actual (Alta precisión)
    let location = await Location.getCurrentPositionAsync({});
    setUbicacion(location.coords);
    setCargando(false);
  };

  

  // Función para elegir color según temperatura
const obtenerColorFondo = (temp) => {
  if (!temp) return '#0a0a0a'; // Negro por defecto
  if (temp > 25) return '#ff4500'; // Naranja/Rojo si hace calor (>25°C)
  if (temp < 15) return '#0000ff'; // Azul si hace frío (<15°C)
  return '#121212'; // Gris oscuro para clima templado
};

  return (
    
    <View style={styles.container}>
      <Text style={styles.titulo}>Nivel 2: Extractor de Sensores</Text>
      
      <TouchableOpacity style={styles.boton} onPress={obtenerCoordenadas}>
        <Text style={styles.botonTexto}>OBTENER MI GPS</Text>
      </TouchableOpacity>

      {cargando && <ActivityIndicator size="large" color="#00ff00" />}

      {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}

      {ubicacion && (
        <View style={styles.resultado}>
          <Text style={styles.dato}>Latitud: {ubicacion.latitude}</Text>
          <Text style={styles.dato}>Longitud: {ubicacion.longitude}</Text>
          <Text style={styles.subDato}>Precisión: {ubicacion.accuracy} metros</Text>
        </View>
      )}
    </View>

    
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', alignItems: 'center', justifyContent: 'center', padding: 20 },
  titulo: { fontSize: 22, color: '#fff', fontWeight: 'bold', marginBottom: 30 },
  boton: { backgroundColor: '#00ff00', padding: 15, borderRadius: 10, marginBottom: 20 },
  botonTexto: { fontWeight: 'bold', color: '#000' },
  resultado: { backgroundColor: '#1e1e1e', padding: 20, borderRadius: 15, width: '100%' },
  dato: { color: '#00ff00', fontSize: 18, fontFamily: 'monospace', marginBottom: 10 },
  subDato: { color: '#666', fontSize: 12 },
  error: { color: '#ff4444', marginTop: 20 }
});
