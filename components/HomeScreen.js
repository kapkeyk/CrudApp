import React, { useState, useEffect } from 'react';
import { set, ref, remove, onValue } from 'firebase/database';
import { db } from '../firebaseService';
import { styles } from '../style/HomeScreenStyles';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  TextInput,
  Image,
} from 'react-native';

const HomeScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [allNotes, setAllNotes] = useState([]);
  const [Editing, setEditing] = useState(false);
  const [filteredNotes, setFilteredNotes] = useState([]);


// Fetching data from Firebase Realtime Database
useEffect(() => {
  const notesRef = ref(db, 'post/');
  onValue(notesRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const notesArray = Object.entries(data).map(([key, value]) => ({
        id: key,
        ...value,
      }));

      setAllNotes(notesArray);
    }
  });
}, []);

// Add note function
const addNote = () => {
  if (title.trim() !== '' && notes.trim() !== '') {
    const currentDate = new Date();
    const createdDate = currentDate.toDateString();
    const createdTime = currentDate.toLocaleTimeString();

    set(ref(db, 'post/' + title), {
      title: title,
      notes: notes,
      createdDate: createdDate,
      createdTime: createdTime,
    })
      .then(() => {
        setTitle('');
        setNotes('');
        setModalVisible(false);
        alert('Note Saved.');
      })
      .catch((error) => {
        alert(error);
      });
  } else {
    alert('Title and notes cannot be empty.');
  }
};

  //DELETE NOTE FUNCTION ************************************
  const deleteNote = (id) => {
    remove(ref(db, 'post/' + id))
      .then(() => {
        setAllNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
        alert('Note Deleted.');
      })
      .catch((error) => {
        alert(error);
      });
  };

  const confirmDeleteNote = (id) => {
    Alert.alert(
      "Delete Note",
      "Are you sure you want to delete this note?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "OK",
          onPress: () => {
            deleteNote(id);
            setTitle('');
            setNotes('');
            setModalVisible(false);
            setEditing(false);
          }
        }
      ]
    );
  };
  //DELETE NOTE FUNCTION ************************************

  //HANDLE ITEM all notes display ***********************************************
  const handleEditItem = (item) => {
    setTitle(item.title);
    setNotes(item.notes);
    setModalVisible(true);
    setEditing(true);
  };
  //HANDLE ITEM all notes display ***********************************************



  // Handle Info Modal **********************************************************
  const toggleInfoModal = () => {
    setInfoModalVisible(!infoModalVisible);
  };
  // Handle Info Modal **********************************************************


  //HANDLE SEARCH QUERY ***************************************************************
  const searchByTitle = (query) => {
    const filtered = allNotes.filter((note) =>
      note.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredNotes(filtered);
  };

  // In your useEffect, set the initial filtered notes to allNotes
  useEffect(() => {
    setFilteredNotes(allNotes);
  }, [allNotes]);
  //HANDLE SEARCH QUERY ***************************************************************


  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={toggleInfoModal} style={styles.infoButton}>
          <Text style={styles.infoButtonText}>i</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ALL NOTES</Text>
        <TextInput
          style={styles.searchInput}
          onChangeText={(text) => searchByTitle(text)}
          placeholder="Search your title"
          placeholderTextColor="#808e9b"
        />
      </View>


      {allNotes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Press ' + ' button to write a note</Text>
        </View>
      ) : (
        <FlatList
          data={filteredNotes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleEditItem(item)}>
              <View style={styles.note}>
                <Text style={styles.noteTitle}>{item.title}</Text>
                <Text numberOfLines={5} style={styles.noteText}>{item.notes}</Text>
                <Text style={styles.noteDate}>Created: {item.createdDate} at {item.createdTime}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>



      {/* ************************************* MODAL FOR NOTES ********************* */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setEditing(false);
          setTitle('');
          setNotes('');
          addNote();
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>

            {/* *********************************** DELETE AND CLOSE ************************* */}
            <View style={styles.closeDeleteButton}>
              {Editing && (
                <TouchableOpacity
                  style={[styles.button, styles.buttonDelete]}
                  onPress={() => confirmDeleteNote(title)}
                >

                  <Image
                    source={require('../icons/delete.png')}
                    style={{ width: 20, height: 24, }} // Adjust size as needed
                  />
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.closeButton, styles.button]}
                onPress={() => {
                  setModalVisible(false);
                  setEditing(false);
                  setTitle('');
                  setNotes('');
                  addNote();
                }}
              >

                <Image
                  source={require('../icons/close.png')}
                  style={{ width: 20, height: 24, }} // Adjust size as needed
                />
              </TouchableOpacity>

            </View>
            {/* *********************************** DELETE AND CLOSE ************************* */}

            <Text style={styles.modalText}>NOTE </Text>

            <TextInput
              value={title}
              onChangeText={(title) => setTitle(title)}
              style={styles.inputTitle}
              mode="outlined"
              label="Title"
              placeholder="Title"
              placeholderTextColor="#808e9b"
            />

            <TextInput
              value={notes}
              onChangeText={setNotes}
              style={styles.inputNote}
              mode="outlined"
              multiline
              placeholder="Note"
              placeholderTextColor="#808e9b"
            />

            <Text style={styles.bottomText}>Artisan: PRINCE (Version 1.0)</Text>
          </View>
        </View>
      </Modal>
      {/* ************************************* MODAL FOR NOTES ********************* */}





      {/* ************************************* MODAL FOR DEV'S INFO ********************* */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={infoModalVisible}
        onRequestClose={toggleInfoModal}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={[styles.closeButton, styles.closeDeleteButton]}
              onPress={toggleInfoModal}
            >
              <Image
                source={require('../icons/close.png')}
                style={{ width: 20, height: 24 }} // Adjust size as needed
              />
            </TouchableOpacity>
            <Text style={[styles.inputTitle, { fontWeight: 'bold' }]}>APP INFO</Text>
            <Text style={styles.infoText}>
              <Text style={{ fontWeight: 'bold' }}>Developer:</Text> Prince Carlo{' '}
              <Text style={{ fontWeight: 'bold' }}>[ theArtisan ]</Text>
            </Text>
            <Text style={styles.infoText}>
              <Text style={{ fontWeight: 'bold' }}>Email:</Text>{' '}
              kkeyk018@gmail.com {'\n'}{'\t\t\t\t\t\t'}pcvt024@gmail.com
            </Text>
            <Text style={styles.infoText}>
              <Text style={{ fontWeight: 'bold' }}>Version:</Text> 1.0
            </Text>
            <Text style={styles.infoText}>
              <Text style={{ fontWeight: 'bold' }}>Created:</Text> May 2024
            </Text>
            <Text style={styles.infoText}>
              This app is designed for personal project{' '}
              <Text style={styles.infoText}>
                <Text style={{ fontWeight: 'bold' }}>ONLY.</Text>
              </Text>
            </Text>
          </View>
        </View>
      </Modal>

      {/* ************************************* MODAL FOR DEV'S INFO ********************* */}

    </View>
  );
};


export default HomeScreen;