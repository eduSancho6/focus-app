import 'package:flutter/material.dart';
import '../services/api_service.dart';

class AreasScreen extends StatefulWidget {
  final ApiService api;

  const AreasScreen({super.key, required this.api});

  @override
  State<AreasScreen> createState() => _AreasScreenState();
}

class _AreasScreenState extends State<AreasScreen> {
  List<dynamic>? _areas;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    try {
      final data = await widget.api.getAreas();
      setState(() => _areas = data);
    } catch (_) {}
  }

  Future<void> _create() async {
    final ctrl = TextEditingController();
    final result = await showDialog<String>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Create Area'),
        content: TextField(controller: ctrl, decoration: const InputDecoration(labelText: 'Name')),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          TextButton(onPressed: () => Navigator.pop(ctx, ctrl.text), child: const Text('Create')),
        ],
      ),
    );
    if (result != null && result.isNotEmpty) {
      await widget.api.createArea(result);
      _load();
    }
  }

  Future<void> _delete(String id) async {
    await widget.api.deleteArea(id);
    _load();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _areas == null
          ? const Center(child: CircularProgressIndicator())
          : ListView.builder(
              itemCount: _areas!.length,
              itemBuilder: (ctx, i) {
                final a = _areas![i] as Map<String, dynamic>;
                return ListTile(
                  title: Text(a['name'] as String),
                  subtitle: Text('${(a['subareas'] as List).length} subareas'),
                  trailing: IconButton(
                    icon: const Icon(Icons.delete, color: Colors.red),
                    onPressed: () => _delete(a['id'] as String),
                  ),
                );
              },
            ),
      floatingActionButton: FloatingActionButton(
        onPressed: _create,
        child: const Icon(Icons.add),
      ),
    );
  }
}
