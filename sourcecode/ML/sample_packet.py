

def SamplePacket():
    
    user = User.objects.create_user(username='testuser', password='testuser123')
    node = Node.objects.create(
        owner=user,
        node_id=1,
        is_active=True
    )
    # Create a packet
    packet = Packet.objects.create(
        nodeID=node,
        mac='A1B2C3',
        spreading_factor=7,
        channel_frequency=868.1,
        transmission_power=14,
        bandwidth=125,
        coding_rate=5,
        snr=8.5,
        rssi=-110.5,
        sequence_number=1,
        payload='HelloWorld',
        payload_size=10,
        num_recieved_per_node=1,
        pdr_per_node=100,
        num_recieved_per_node_per_window=1,
        last_seq_num_at_window_start=0,
        pdr_per_node_per_window=100,
        inter_arrival_time_s=2.5,
        inter_arrival_time_m=0.0416
    )
    return Response({"Success"})