import 'package:flutter/material.dart';
import '../services/api_service.dart';

class HabitsScreen extends StatefulWidget {
  final ApiService api;

  const HabitsScreen({super.key, required this.api});

  @override
  State<HabitsScreen> createState() => _HabitsScreenState();
}

class _HabitsScreenState extends State<HabitsScreen> {
  List<dynamic>? _habits;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    try {
      final data = await widget.api.getHabits();
      setState(() => _habits = data);
    } catch (_) {}
  }

  Future<void> _create() async {
    final ctrl = TextEditingController();
    final result = await showDialog<String>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Create Habit'),
        content: TextField(controller: ctrl, decoration: const InputDecoration(labelText: 'Name')),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          TextButton(onPressed: () => Navigator.pop(ctx, ctrl.text), child: const Text('Create')),
        ],
      ),
    );
    if (result != null && result.isNotEmpty) {
      await widget.api.createHabit(result);
      _load();
    }
  }

  Future<void> _delete(String id) async {
    await widget.api.deleteHabit(id);
    _load();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _habits == null
          ? const Center(child: CircularProgressIndicator())
          : ListView.builder(
              itemCount: _habits!.length,
              itemBuilder: (ctx, i) {
                final h = _habits![i] as Map<String, dynamic>;
                return ListTile(
                  title: Text(h['name'] as String),
                  trailing: IconButton(
                    icon: const Icon(Icons.delete, color: Colors.red),
                    onPressed: () => _delete(h['id'] as String),
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
