from django.test import TestCase
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta
from lorawan.models import UserProfile, Node, Packet, MLModel, Anomaly, ModelTrainingInfo, ModelPredictionInfo, Alert, Log

# Creation, deletion, update tests for all models apart from UserProfile which was not used
# Format is as follows: 
    # Setup test environment with associated models (e.g. user)
    # Test Creation 
    # Test Updating
    # Test Deleting

class NodeTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='password')
        self.node = Node.objects.create(
            owner=self.user,
            node_id=1,
            is_active=True,
        )
    
    def test_node_creation(self):
        self.assertEqual(self.node.node_id, 1)
        self.assertTrue(self.node.is_active)
        self.assertEqual(self.node.owner, self.user)
    
    def test_node_string_representation(self):
        self.assertEqual(str(self.node), "Node 1")


class PacketTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='password')
        self.node = Node.objects.create(
            owner=self.user,
            node_id=1,
            is_active=True
        )

        self.packet = Packet.objects.create(
            time=timezone.now(),
            nodeID=self.node,
            mac='A1B2C3',
            spreading_factor=7,
            channel_frequency=868.1,
            transmission_power=14,
            bandwidth=125,
            coding_rate=5,
            snr=8.5,
            rssi=-110.5,
            sequence_number=1,
            payload='payload',
            payload_size=10,
            num_recieved_per_node=1,
            pdr_per_node=100,
            num_recieved_per_node_per_window=1,
            current_seq_num=0,
            last_seq_num_at_window_start=0,
            pdr_per_node_per_window=100,
            inter_arrival_time_s=2.5,
            inter_arrival_time_m=0.0416,
            owner=self.user
        )
    
    def test_packet_creation(self):
        self.assertEqual(self.packet.nodeID, self.node)
        self.assertEqual(self.packet.mac, 'A1B2C3')
        self.assertEqual(self.packet.spreading_factor, 7)
        self.assertEqual(self.packet.channel_frequency, 868.1)
        self.assertEqual(self.packet.snr, 8.5)
        self.assertEqual(self.packet.rssi, -110.5)
        self.assertEqual(self.packet.payload_size, 10)
        self.assertFalse(self.packet.is_anomalous)
    
    def test_packet_string_representation(self):
        expected = f"Packet {self.packet.id} at {self.packet.time}"
        self.assertEqual(str(self.packet), expected)

    def test_packet_node_cascade_delete(self):
        packet_id = self.packet.id
        self.node.delete()
        self.assertFalse(Packet.objects.filter(id=packet_id).exists())

class MLModelTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='password')
        self.ml_model = MLModel.objects.create(
            name='Isolation Forest',
            version=1.0,
            algorithm_type='IsolationForest',
            owner=self.user
        )
    
    def test_mlmodel_creation(self):
        self.assertEqual(self.ml_model.name, 'Isolation Forest')
        self.assertEqual(self.ml_model.version, 1.0)
        self.assertEqual(self.ml_model.algorithm_type, 'IsolationForest')
        self.assertEqual(self.ml_model.owner, self.user)

class AnomalyTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='password')
        self.node = Node.objects.create(
            owner=self.user,
            node_id=1,
            is_active=True
        )

        self.packet = Packet.objects.create(
            time=timezone.now(),
            nodeID=self.node,
            mac='A1B2C3',
            spreading_factor=7,
            channel_frequency=868.1,
            transmission_power=14,
            bandwidth=125,
            coding_rate=5,
            snr=8.5,
            rssi=-110.5,
            sequence_number=1,
            payload='payload',
            payload_size=10,
            num_recieved_per_node=1,
            pdr_per_node=100,
            num_recieved_per_node_per_window=1,
            current_seq_num=0,
            last_seq_num_at_window_start=0,
            pdr_per_node_per_window=100,
            inter_arrival_time_s=2.5,
            inter_arrival_time_m=0.0416,
            owner=self.user
        )

        self.ml_model = MLModel.objects.create(
            name='Isolation Forest',
            version = 1.0,
            algorithm_type='IsolationForest',
            owner=self.user
        )

        self.anomaly = Anomaly.objects.create(
            packet=self.packet,
            model=self.ml_model,
            anomaly_score=0.5,
            owner = self.user
            )

    def test_anomaly_creation(self):
        self.assertEqual(self.anomaly.packet, self.packet)
        self.assertEqual(self.anomaly.model, self.ml_model)
        self.assertEqual(self.anomaly.anomaly_score, 0.5)
        self.assertEqual(self.anomaly.owner, self.user)

class ModelTrainingInfoTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='password')
        self.ml_model = MLModel.objects.create(
            name='Isolation Forest',
            version=1.0,
            algorithm_type='IsolationForest',
            owner=self.user
        )

        self.training_info = ModelTrainingInfo.objects.create(
            model_id=self.ml_model,
            trained_at=timezone.now(),
            training_data_file='test.csv',
            num_training_samples=1000,
            contamination=0.01,
            is_active=True,
            owner=self.user
        )

    def test_training_info_creation(self):
        self.assertEqual(self.training_info.model_id, self.ml_model)
        self.assertEqual(self.training_info.training_data_file, 'test.csv')
        self.assertEqual(self.training_info.num_training_samples, 1000)
        self.assertEqual(self.training_info.contamination, 0.01)
        self.assertTrue(self.training_info.is_active)

class ModelPredictionInfoTestCase(TestCase):
    def setUp(self):
        self.user=User.objects.create_user(username='testuser', password='password')
        self.ml_model = MLModel.objects.create(
            name='Isolation Forest',
            version=1.0,
            algorithm_type='IsolationForest',
            owner=self.user
        )

        self.training_info = ModelTrainingInfo.objects.create(
            model_id=self.ml_model,
            training_data_file='test.csv',
            num_training_samples=1000,
            contamination=0.01,
            owner=self.user
        )

        self.prediction_info = ModelPredictionInfo.objects.create(
            model_id = self.ml_model,
            training_run_id=self.training_info,
            input_file_name='test.csv',
            num_packets=500,
            anomalies_detected=5,
            anomaly_percentage=1.0,
            silhouette_score=0.45,
            mean_anomaly_score=-0.5,
            std_anomaly_score=0.2,
            min_anomaly_score=-1.0,
            max_anomaly_score=0.5,
            accuracy=0.95,
            precision=0.90,
            recall=0.85,
            f1_score=0.87,
            owner=self.user      
        )

    def test_prediction_info_creation(self):
        self.assertEqual(self.prediction_info.model_id, self.ml_model)
        self.assertEqual(self.prediction_info.training_run_id, self.training_info)
        self.assertEqual(self.prediction_info.num_packets, 500)
        self.assertEqual(self.prediction_info.anomalies_detected, 5)
        self.assertEqual(self.prediction_info.anomaly_percentage, 1.0)
        self.assertEqual(self.prediction_info.accuracy, 0.95)

class AlertTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='password')
        self.node = Node.objects.create(
            owner=self.user,
            node_id=1,
            is_active=True
        )
        self.ml_model = MLModel.objects.create(
            name='Isolation Forest',
            version=1.0,
            algorithm_type='IsolationForest',
            owner=self.user
        )
        self.alert = Alert.objects.create(
            owner = self.user,
            title="Anomaly Detected",
            message="Anomalies were detected",
            alert_type='anomaly',
            severity='warning',
            node=self.node,
            model=self.ml_model
        )
    
    def test_alert_creation(self):
        self.assertEqual(self.alert.title, 'Anomaly Detected')
        self.assertEqual(self.alert.alert_type, 'anomaly')
        self.assertEqual(self.alert.severity, 'warning')
        self.assertEqual(self.alert.owner, self.user)
        self.assertFalse(self.alert.is_resolved)

class LogTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.node = Node.objects.create(owner=self.user, node_id=1, is_active=True)
        self.log = Log.objects.create(
            owner=self.user,
            title='Device Added',
            description='New device Node 1 has been added',
            log_type='device_added',
            severity='info',
            node=self.node
        )

    def test_log_creation(self):
        self.assertEqual(self.log.title, 'Device Added')
        self.assertEqual(self.log.log_type, 'device_added')
        self.assertEqual(self.log.severity, 'info')
        self.assertEqual(self.log.owner, self.user)