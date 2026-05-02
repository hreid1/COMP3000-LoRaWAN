from django.test import TestCase
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta
from lorawan.models import UserProfile, Node, Packet, MLModel, Anomaly, ModelPredictionInfo, ModelTrainingInfo, Alert, Log

# CRUD operations for each of the models apart from modeltraininginfo and userprofile as they were not used


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

    def test_node_update(self):
        self.node.is_active = False
        self.node.save()
        self.node.refresh_from_db()
        self.assertFalse(self.node.is_active)

    def test_node_delete(self):
        nodeID = self.node.id
        self.node.delete()
        self.assertFalse(Node.objects.filter(id=nodeID).exists())
    
    def test_node_creation_with_same_nodeid(self):
        with self.assertRaises(Exception):
            Node.objects.create(
                owner=self.user,
                node_id=1,  
                is_active=True
            )

    def test_multiple_nodes_to_one_user(self):
        node2 = Node.objects.create(
            owner=self.user,
            node_id=2,
            is_active=True
        )
        userNodes = Node.objects.filter(owner=self.user)
        self.assertEqual(userNodes.count(), 2)
    
    def test_optional_longitude(self):
        node = Node.objects.create(
            owner=self.user,
            node_id=3,
            is_active=True
        )
        self.assertIsNone(node.longitude)


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

    def test_packet_update(self):
        self.packet.is_anomalous = True
        self.packet.save()
        self.packet.refresh_from_db()
        self.assertTrue(self.packet.is_anomalous)
    
    def test_packet_delete(self):
        packetId = self.packet.id
        self.packet.delete()
        self.assertFalse(Packet.objects.filter(id=packetId).exists())

    def test_packet_node_cascade_delete(self):
        packetId = self.packet.id
        self.node.delete()
        self.assertFalse(Packet.objects.filter(id=packetId).exists())

    
class MLModelTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='password')
        self.mlModel = MLModel.objects.create(
            name='Isolation Forest',
            version=1.0,
            algorithm_type='IsolationForest',
            owner=self.user
        )
    
    def test_mlmodel_creation(self):
        self.assertEqual(self.mlModel.name, 'Isolation Forest')
        self.assertEqual(self.mlModel.version, 1.0)
        self.assertEqual(self.mlModel.algorithm_type, 'IsolationForest')
        self.assertEqual(self.mlModel.owner, self.user)

    def test_mlmodel_update(self):
        self.mlModel.version = 2.0
        self.mlModel.save()
        self.mlModel.refresh_from_db()
        self.assertEqual(self.mlModel.version, 2.0)

    def test_mlmodel_delete(self):
        modelId = self.mlModel.id
        self.mlModel.delete()
        self.assertFalse(MLModel.objects.filter(id=modelId).exists())

    def test_multiple_mlmodel_one_user(self):
        model2 = MLModel.objects.create(
            name='Local Outlier Factor',
            version=1.0,
            algorithm_type='LOF',
            owner=self.user
        )
        userModels = MLModel.objects.filter(owner=self.user)
        self.assertEqual(userModels.count(), 2)
    

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

        self.mlModel = MLModel.objects.create(
            name='Isolation Forest',
            version = 1.0,
            algorithm_type='IsolationForest',
            owner=self.user
        )

        self.anomaly = Anomaly.objects.create(
            packet=self.packet,
            model=self.mlModel,
            anomaly_score=0.5,
            owner = self.user
        )

    def test_anomaly_creation(self):
        self.assertEqual(self.anomaly.packet, self.packet)
        self.assertEqual(self.anomaly.model, self.mlModel)
        self.assertEqual(self.anomaly.anomaly_score, 0.5)
        self.assertEqual(self.anomaly.owner, self.user)

    def test_anomaly_update(self):
        self.anomaly.anomaly_score = 0.8
        self.anomaly.save()
        self.anomaly.refresh_from_db()
        self.assertEqual(self.anomaly.anomaly_score, 0.8)

    def test_anomaly_delete(self):
        anomalyId = self.anomaly.id
        self.anomaly.delete()
        self.assertFalse(Anomaly.objects.filter(id=anomalyId).exists())

    def test_anomaly_cascade_delete(self):
        anomalyId = self.anomaly.id
        self.mlModel.delete()
        self.assertFalse(Anomaly.objects.filter(id=anomalyId).exists())

    def test_multiple_anomalies_per_user(self):
        model2 = MLModel.objects.create(
            name='LOF',
            version=1.0,
            algorithm_type='LOF',
            owner=self.user
        )
        anomaly2 = Anomaly.objects.create(
            packet=self.packet,
            model=model2,
            anomaly_score=0.6,
            owner=self.user
        )
        packetAnomalies = Anomaly.objects.filter(packet=self.packet)
        self.assertEqual(packetAnomalies.count(), 2)


class ModelPredictionInfoTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='password')
        self.mlModel = MLModel.objects.create(
            name='Isolation Forest',
            version=1.0,
            algorithm_type='IsolationForest',
            owner=self.user
        )

        self.predictionInfo = ModelPredictionInfo.objects.create(
            model_id = self.mlModel,
            training_run_id=None,
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
        self.assertEqual(self.predictionInfo.model_id, self.mlModel)
        self.assertEqual(self.predictionInfo.num_packets, 500)
        self.assertEqual(self.predictionInfo.anomalies_detected, 5)
        self.assertEqual(self.predictionInfo.anomaly_percentage, 1.0)
        self.assertEqual(self.predictionInfo.accuracy, 0.95)

    def test_prediction_delete(self):
        predictionId = self.predictionInfo.id
        self.predictionInfo.delete()
        self.assertFalse(ModelPredictionInfo.objects.filter(id=predictionId).exists())


class AlertTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='password')
        self.node = Node.objects.create(
            owner=self.user,
            node_id=1,
            is_active=True
        )
        self.mlModel = MLModel.objects.create(
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
            model=self.mlModel
        )
    
    def test_alert_creation(self):
        self.assertEqual(self.alert.title, 'Anomaly Detected')
        self.assertEqual(self.alert.alert_type, 'anomaly')
        self.assertEqual(self.alert.severity, 'warning')
        self.assertEqual(self.alert.owner, self.user)
        self.assertFalse(self.alert.is_resolved)

    def test_update_alert(self):
        self.alert.is_resolved = True
        self.alert.resolved_by = self.user
        self.alert.resolved_at = timezone.now().date()
        self.alert.save()
        self.alert.refresh_from_db()
        self.assertTrue(self.alert.is_resolved)
        self.assertEqual(self.alert.resolved_by, self.user)

    def test_severity_choices_alert(self):
        alert = Alert.objects.create(
            owner=self.user,
            title='System Error',
            message='System error occurred',
            severity='error',
            alert_type='system'
        )
        self.assertEqual(alert.severity, 'error')
    
    def test_alert_cascade_delete_owner(self):
        alertId = self.alert.id
        self.user.delete()
        self.assertFalse(Alert.objects.filter(id=alertId).exists())


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

    def test_log_update(self):
        self.log.description = 'Updated description'
        self.log.save()
        self.log.refresh_from_db()
        self.assertEqual(self.log.description, 'Updated description')

    def test_log_choices(self):
        log = Log.objects.create(
            owner=self.user,
            title='Model Run',
            log_type='model_run',
            severity='info'
        )
        self.assertEqual(log.log_type, 'model_run')

    def test_log_owner_cascade_delete(self):
        logID = self.log.id
        self.user.delete()
        self.assertFalse(Log.objects.filter(id=logID).exists())
