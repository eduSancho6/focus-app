import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../models/models.dart';

class TasksScreen extends StatefulWidget {
  final ApiService api;

  const TasksScreen({super.key, required this.api});

  @override
  State<TasksScreen> createState() => _TasksScreenState();
}

class _TasksScreenState extends State<TasksScreen> {
  List<TaskModel>? _tasks;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadTasks();
  }

  Future<void> _loadTasks() async {
    try {
      final data = await widget.api.getList('/tasks');
      setState(() {
        _tasks = data.map((j) => TaskModel.fromJson(j as Map<String, dynamic>)).toList();
        _error = null;
      });
    } catch (e) {
      setState(() => _error = e.toString());
    }
  }

  Future<void> _createTask() async {
    final descCtrl = TextEditingController();
    final typeCtrl = TextEditingController(text: 'WORK');

    final result = await showDialog<Map<String, String>>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Create Task'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(controller: descCtrl, decoration: const InputDecoration(labelText: 'Description')),
            const SizedBox(height: 8),
            TextField(controller: typeCtrl, decoration: const InputDecoration(labelText: 'Type (WORK/HEALTH/PERSONAL/ACADEMIC)')),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          TextButton(
            onPressed: () => Navigator.pop(ctx, {'description': descCtrl.text, 'type': typeCtrl.text}),
            child: const Text('Create'),
          ),
        ],
      ),
    );

    if (result != null) {
      try {
        await widget.api.createTask(description: result['description']!, type: result['type']!);
        _loadTasks();
      } catch (e) {
        setState(() => _error = e.toString());
      }
    }
  }

  Future<void> _completeTask(TaskModel task) async {
    final feedback = await showDialog<String>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Complete Task'),
        content: const Text('Select feedback type:'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx, 'DISCIPLINE'), child: const Text('DISCIPLINE')),
          TextButton(onPressed: () => Navigator.pop(ctx, 'CONCENTRATION'), child: const Text('CONCENTRATION')),
        ],
      ),
    );

    if (feedback != null) {
      try {
        await widget.api.completeTask(task.id, feedback);
        _loadTasks();
      } catch (e) {
        setState(() => _error = e.toString());
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _error != null
          ? Center(child: Text('Error: $_error', style: const TextStyle(color: Colors.red)))
          : _tasks == null
              ? const Center(child: CircularProgressIndicator())
              : RefreshIndicator(
                  onRefresh: _loadTasks,
                  child: ListView.builder(
                    itemCount: _tasks!.length,
                    itemBuilder: (ctx, i) {
                      final task = _tasks![i];
                      return ListTile(
                        leading: Icon(
                          task.completed ? Icons.check_circle : Icons.circle_outlined,
                          color: task.completed ? Colors.green : Colors.grey,
                        ),
                        title: Text(task.description, style: TextStyle(
                          decoration: task.completed ? TextDecoration.lineThrough : null,
                        )),
                        subtitle: Text('${task.type}  •  ${task.effortPoints}pts'),
                        trailing: task.completed
                            ? null
                            : IconButton(
                                icon: const Icon(Icons.done, color: Colors.green),
                                onPressed: () => _completeTask(task),
                              ),
                      );
                    },
                  ),
                ),
      floatingActionButton: FloatingActionButton(
        onPressed: _createTask,
        child: const Icon(Icons.add),
      ),
    );
  }
}
