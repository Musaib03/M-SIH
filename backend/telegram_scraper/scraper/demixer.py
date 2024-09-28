class BestMixerDemixer:
    def __init__(self, bc_client, cluster_client):
        self.bc_client = bc_client
        self.cluster_client = cluster_client

    def get_involved_parties(self, transactions):
        return ["address1", "address2"]

    def get_real_receiver(self, transactions):
        return "real_receiver_address"

class BestMixerLTCDemixer(BestMixerDemixer):
	pass