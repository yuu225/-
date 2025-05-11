<template>
  <div class="teacher-container">
    <el-card shadow="hover">
      <div class="operation-bar">
        <el-button type="info" plain @click="goToHome">
          <el-icon><HomeFilled /></el-icon> 返回主页
        </el-button>
        <el-input
          v-model="searchQuery"
          placeholder="搜索教师..."
          style="width: 300px; margin-left: 10px"
          clearable
          @clear="handleSearch"
          @keyup.enter="handleSearch"
        >
          <template #append>
            <el-button :icon="Search" @click="handleSearch" />
          </template>
        </el-input>
        <el-button type="primary" @click="handleAdd" style="margin-left: 10px">
          <el-icon><Plus /></el-icon> 新增教师
        </el-button>
      </div>

      <el-table :data="tableData" border stripe style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="姓名" width="120" />
        <el-table-column prop="gender" label="性别" width="80">
          <template #default="{ row }">
            {{ row.gender === 'male' ? '男' : '女' }}
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="电话" width="150" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="subject" label="教授科目" width="120" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="50%" @closed="resetForm">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="formData.gender">
            <el-radio label="male">男</el-radio>
            <el-radio label="female">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="formData.phone" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email" />
        </el-form-item>
        <el-form-item label="教授科目" prop="subject">
          <el-select v-model="formData.subject" placeholder="请选择">
            <el-option
              v-for="item in subjectOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Plus, HomeFilled } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'

interface Teacher {
  id: number
  name: string
  gender: string
  phone: string
  email: string
  subject: string
}

const router = useRouter()

const goToHome = () => {
  router.push('/').catch((err) => {
    console.error('导航错误:', err)
  })
}

const tableData = ref<Teacher[]>([])
const loading = ref(false)
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const dialogVisible = ref(false)
const dialogTitle = ref('新增教师')
const formRef = ref<FormInstance>()
const formData = reactive<Omit<Teacher, 'id'>>({
  name: '',
  gender: 'male',
  phone: '',
  email: '',
  subject: '',
})

const formRules = reactive<FormRules>({
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  phone: [
    { required: true, message: '请输入电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
  ],
  subject: [{ required: true, message: '请选择科目', trigger: 'change' }],
})

const subjectOptions = [
  { value: 'math', label: '数学' },
  { value: 'english', label: '英语' },
  { value: 'physics', label: '物理' },
  { value: 'chemistry', label: '化学' },
]

const fetchTeachers = async () => {
  loading.value = true
  try {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const mockData: Teacher[] = Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      name: `教师${i + 1}`,
      gender: i % 2 === 0 ? 'male' : 'female',
      phone: `138${Math.floor(10000000 + Math.random() * 90000000)}`,
      email: `teacher${i + 1}@school.com`,
      subject: ['math', 'english', 'physics', 'chemistry'][i % 4],
    }))

    const filtered = mockData.filter(
      (item) =>
        item.name.includes(searchQuery.value) ||
        item.phone.includes(searchQuery.value) ||
        item.email.includes(searchQuery.value),
    )
    const start = (currentPage.value - 1) * pageSize.value
    tableData.value = filtered.slice(start, start + pageSize.value)
    total.value = filtered.length
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  fetchTeachers()
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  fetchTeachers()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchTeachers()
}

const handleAdd = () => {
  dialogTitle.value = '新增教师'
  dialogVisible.value = true
}

const handleEdit = (row: Teacher) => {
  dialogTitle.value = '编辑教师'
  Object.assign(formData, row)
  dialogVisible.value = true
}

const resetForm = () => {
  formRef.value?.resetFields()
  Object.assign(formData, {
    name: '',
    gender: 'male',
    phone: '',
    email: '',
    subject: '',
  })
}

const submitForm = async () => {
  if (!formRef.value) return
  await formRef.value.validate()

  await new Promise((resolve) => setTimeout(resolve, 500))
  ElMessage.success(dialogTitle.value + '成功')

  dialogVisible.value = false
  fetchTeachers()
}

const handleDelete = (id: number) => {
  ElMessageBox.confirm('确定删除该教师吗?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      ElMessage.success('删除成功')
      fetchTeachers()
    })
    .catch(() => {})
}

onMounted(() => {
  fetchTeachers()
})
</script>

<style scoped>
.teacher-container {
  padding: 20px;
}
.operation-bar {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}
.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
